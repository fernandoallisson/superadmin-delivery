import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { importacaoService } from "../../features/importacao/importacaoService";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Label } from "../../components/ui/label";

export default function ImportProdutos() {
  const [file, setFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setErrorMsg("");
      setImportResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    maxFiles: 1,
  });

  const mutation = useMutation({
    mutationFn: () => {
      if (!file) throw new Error("Selecione um arquivo.");
      return importacaoService.importCSV(file);
    },
    onSuccess: (data) => {
      setImportResult(data);
      setFile(null); // Limpar após sucesso
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.error?.message || err.response?.data?.message || err.message || "Erro desconhecido ao importar.");
    },
  });

  const handleImport = () => {
    setErrorMsg("");
    setImportResult(null);
    if (!file) {
      setErrorMsg("Por favor, envie um arquivo CSV.");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Importar Produtos em Massa</h2>
        <p className="text-muted-foreground text-sm">
          Faça o upload de um arquivo CSV para cadastrar produtos no catálogo global.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações de Importação</CardTitle>
          <CardDescription>
            Selecione o arquivo CSV contendo os produtos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Área de Drag & Drop para o CSV */}
          <div className="space-y-2">
            <Label>Arquivo CSV <span className="text-red-500">*</span></Label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center transition-colors cursor-pointer ${
                isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-900"
              }`}
            >
              <input {...getInputProps()} />
              
              {file ? (
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-2">
                    Remover arquivo
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center space-y-2 text-muted-foreground">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-2">
                    <UploadCloud className="h-8 w-8" />
                  </div>
                  <p className="text-sm font-medium">Clique ou arraste o arquivo CSV aqui</p>
                  <p className="text-xs">Apenas arquivos .csv são suportados</p>
                </div>
              )}
            </div>
          </div>

          {/* Erros */}
          {errorMsg && (
            <div className="flex items-start gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/10 rounded-md">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}

          {/* Sucesso */}
          {importResult && (
            <div className="p-4 border border-green-200 bg-green-50 dark:bg-green-900/10 rounded-md space-y-2">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-500">
                <CheckCircle className="w-5 h-5" />
                <p className="font-semibold">{importResult.message || "Importação concluída!"}</p>
              </div>
              <div className="text-sm text-green-800 dark:text-green-400 pl-7">
                <p>Foram importados {importResult.data?.totalImportado || 0} produtos no catálogo global.</p>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end pt-4">
            <Button onClick={handleImport} disabled={!file || mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 mr-2" />
                  Iniciar Importação
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
