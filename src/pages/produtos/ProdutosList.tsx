import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Package, Plus, Search, Edit, Trash2, MoreVertical, Settings } from "lucide-react";
import { produtoService, type Produto } from "../../features/produtos/produtoService";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Badge } from "../../components/ui/badge";

export default function ProdutosList() {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["produtos"],
    queryFn: () => produtoService.getAll(),
  });

  const produtos: Produto[] = Array.isArray(data?.data?.data) 
    ? data.data.data 
    : (Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []));

  const deleteMutation = useMutation({
    mutationFn: (id: string) => produtoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
  });

  const toggleAtivoMutation = useMutation({
    mutationFn: ({ id, ativo }: { id: string; ativo: boolean }) =>
      produtoService.toggleAtivo(id, ativo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
  });

  const filteredProdutos = produtos.filter((p) =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.codigo_barras?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Produtos Globais</h2>
          <p className="text-muted-foreground">Gerencie o catálogo global de produtos da plataforma.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/products/import">
            <Button variant="outline">
              <Package className="w-4 h-4 mr-2" />
              Importar CSV
            </Button>
          </Link>
          <Link to="/products/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Produto</th>
                  <th className="px-4 py-3 font-medium">Cód. Barras</th>
                  <th className="px-4 py-3 font-medium">Marca</th>
                  <th className="px-4 py-3 font-medium">Unidade</th>
                  <th className="px-4 py-3 font-medium text-center">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      Carregando produtos...
                    </td>
                  </tr>
                ) : filteredProdutos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredProdutos.map((produto) => (
                    <tr key={produto.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {produto.imagem_url ? (
                              <img src={produto.imagem_url} alt={produto.nome} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              {produto.nome}
                            </p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {produto.descricao || "Sem descrição"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {produto.codigo_barras || "-"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {produto.marca || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="font-normal">
                          {produto.unidade_medida}
                          {produto.vendavel_por_peso && " (Peso)"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge 
                          variant={produto.ativo ? "default" : "secondary"}
                          className={produto.ativo ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100" : ""}
                        >
                          {produto.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link to={`/products/${produto.id}`}>
                              <DropdownMenuItem className="cursor-pointer">
                                <Settings className="w-4 h-4 mr-2" />
                                Detalhes / Variações
                              </DropdownMenuItem>
                            </Link>
                            <Link to={`/products/${produto.id}/edit`}>
                              <DropdownMenuItem className="cursor-pointer">
                                <Edit className="w-4 h-4 mr-2" />
                                Editar Produto
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => toggleAtivoMutation.mutate({ id: produto.id, ativo: !produto.ativo })}
                            >
                              <div className="w-4 h-4 mr-2 rounded-full border border-current flex items-center justify-center">
                                {produto.ativo && <div className="w-2 h-2 rounded-full bg-current" />}
                              </div>
                              {produto.ativo ? "Desativar" : "Ativar"}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer text-red-600 focus:text-red-600"
                              onClick={() => {
                                if (window.confirm("Tem certeza que deseja excluir este produto?")) {
                                  deleteMutation.mutate(produto.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
