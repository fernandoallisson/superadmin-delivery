import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storeService } from "../../features/stores/storeService";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";

const storeSchema = z.object({
  nome: z.string().min(3, "O nome da loja é obrigatório"),
  razao_social: z.string().optional(),
  cnpj: z.string().min(14, "CNPJ inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  email: z.string().email("E-mail inválido"),
  descricao: z.string().optional(),
  status: z.enum(["ativo", "inativo", "suspenso"]).default("ativo"),
});

type StoreFormValues = z.infer<typeof storeSchema>;

export default function StoreForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      status: "ativo"
    }
  });

  const { data: store, isLoading } = useQuery({
    queryKey: ["store", id],
    queryFn: () => storeService.getById(id!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (store && isEditing) {
      reset({
        nome: store.nome,
        cnpj: store.cnpj,
        telefone: store.telefone,
        email: store.email,
        status: store.status as any,
      });
    }
  }, [store, reset, isEditing]);

  const mutation = useMutation({
    mutationFn: (data: StoreFormValues) => {
      if (isEditing) {
        return storeService.update(id, data);
      }
      return storeService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      navigate("/stores");
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || "Erro ao salvar loja.");
    }
  });

  const onSubmit = (data: StoreFormValues) => {
    mutation.mutate(data);
  };

  if (isEditing && isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Carregando dados da loja...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/stores">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {isEditing ? "Editar Loja" : "Nova Loja"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isEditing ? "Altere as informações da loja existente." : "Preencha os dados para cadastrar uma nova loja."}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>Dados principais de identificação da loja.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-100/50 rounded-md">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Loja <span className="text-red-500">*</span></Label>
                <Input id="nome" placeholder="Ex: Mercado Compre Bem" {...register("nome")} className={errors.nome ? "border-red-500" : ""} />
                {errors.nome && <span className="text-xs text-red-500">{errors.nome.message}</span>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="razao_social">Razão Social</Label>
                <Input id="razao_social" placeholder="Compre Bem LTDA" {...register("razao_social")} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ <span className="text-red-500">*</span></Label>
                <Input id="cnpj" placeholder="00.000.000/0000-00" {...register("cnpj")} className={errors.cnpj ? "border-red-500" : ""} />
                {errors.cnpj && <span className="text-xs text-red-500">{errors.cnpj.message}</span>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail de Contato <span className="text-red-500">*</span></Label>
                <Input id="email" type="email" placeholder="contato@comprebem.com" {...register("email")} className={errors.email ? "border-red-500" : ""} />
                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone / WhatsApp <span className="text-red-500">*</span></Label>
                <Input id="telefone" placeholder="(00) 00000-0000" {...register("telefone")} className={errors.telefone ? "border-red-500" : ""} />
                {errors.telefone && <span className="text-xs text-red-500">{errors.telefone.message}</span>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select 
                  id="status" 
                  {...register("status")} 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="suspenso">Suspenso</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 border-t pt-4 mt-6">
              <Label htmlFor="descricao">Descrição (Opcional)</Label>
              <textarea 
                id="descricao" 
                rows={3}
                placeholder="Breve descrição da loja..." 
                {...register("descricao")}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Link to="/stores">
                <Button variant="outline" type="button">Cancelar</Button>
              </Link>
              <Button type="submit" disabled={mutation.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {mutation.isPending ? "Salvando..." : "Salvar Loja"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
