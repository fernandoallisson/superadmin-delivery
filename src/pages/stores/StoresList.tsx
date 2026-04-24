import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { storeService, type Store } from "../../features/stores/storeService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Plus, Search, Edit, MoreHorizontal, Eye, Ban } from "lucide-react";

export default function StoresList() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["stores"],
    queryFn: () => storeService.getAll(),
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "ativo": return <Badge variant="success">Ativo</Badge>;
      case "inativo": return <Badge variant="secondary">Inativo</Badge>;
      case "suspenso": return <Badge variant="destructive">Suspenso</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stores = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);

  const filteredStores = stores.filter((store: Store) => 
    store.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    store.cnpj?.includes(searchTerm) ||
    store.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciamento de Lojas</h2>
          <p className="text-muted-foreground text-sm">Visualize e gerencie todas as lojas da plataforma.</p>
        </div>
        <Link to="/stores/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nova Loja
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome, CNPJ ou e-mail..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white dark:bg-slate-950 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Carregando lojas...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-red-500">
                  Erro ao carregar lojas.
                </TableCell>
              </TableRow>
            ) : filteredStores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhuma loja encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredStores.map((store: Store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">{store.nome}</TableCell>
                  <TableCell>{store.cnpj}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{store.email}</span>
                      <span className="text-xs text-muted-foreground">{store.telefone}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(store.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" title="Visualizar">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Link to={`/stores/${store.id}/edit`}>
                        <Button variant="ghost" size="icon" title="Editar">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" title="Ações">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
