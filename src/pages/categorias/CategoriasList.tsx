import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriaService, type Categoria } from "../../features/categorias/categoriaService";
import { Button } from "../../components/ui/button";
import { 
  Plus, Edit2, Trash2, 
  Search, Filter, CheckCircle, XCircle
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useForm } from "react-hook-form";
import { Badge } from "../../components/ui/badge";

export default function CategoriasList() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const queryClient = useQueryClient();

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["categorias"],
    queryFn: categoriaService.getAll,
  });

  const categorias = Array.isArray(categoriesData?.data?.data) 
    ? categoriesData.data.data
    : (Array.isArray(categoriesData?.data) 
      ? categoriesData.data 
      : (Array.isArray(categoriesData) ? categoriesData : []));

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      setMessage({ type: 'success', text: "Categoria excluída com sucesso" });
      setTimeout(() => setMessage(null), 3000);
    },
    onError: () => {
      setMessage({ type: 'error', text: "Erro ao excluir categoria" });
      setTimeout(() => setMessage(null), 3000);
    },
  });

  const filteredCategorias = categorias.filter((c: Categoria) =>
    c.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategoria(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Categorias Globais</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Gerencie as categorias de produtos disponíveis para todas as lojas.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Categoria
        </Button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="flex items-center gap-4 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">Ícone</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-center">Ordem</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                  Carregando categorias...
                </TableCell>
              </TableRow>
            ) : filteredCategorias.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                  Nenhuma categoria encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredCategorias.map((categoria: Categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell className="text-2xl text-center">{categoria.emoji || "📁"}</TableCell>
                  <TableCell className="font-medium">{categoria.nome}</TableCell>
                  <TableCell className="text-slate-500 font-mono text-xs">{categoria.slug}</TableCell>
                  <TableCell className="text-center">{categoria.ordem_exibicao}</TableCell>
                  <TableCell className="text-center">
                    {categoria.ativa ? (
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Ativa
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-slate-400 border-slate-200 bg-slate-50 gap-1">
                        <XCircle className="w-3 h-3" />
                        Inativa
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleOpenEdit(categoria)}
                        className="h-8 w-8 text-slate-400 hover:text-primary"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(categoria.id)}
                        className="h-8 w-8 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Simple Modal Implementation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold">{editingCategoria ? "Editar Categoria" : "Nova Categoria"}</h3>
            </div>
            <div className="p-6">
              <CategoriaFormModal 
                categoria={editingCategoria} 
                onClose={handleCloseModal} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoriaFormModal({ categoria, onClose }: { categoria: Categoria | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: categoria || {
      nome: "",
      slug: "",
      emoji: "📁",
      ordem_exibicao: 0,
      ativa: true
    }
  });

  const mutation = useMutation({
    mutationFn: (data: any) => 
      categoria ? categoriaService.update(categoria.id, data) : categoriaService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      onClose();
    },
    onError: (err: any) => {
      const errorMsg = err.response?.data?.message || "Erro ao salvar categoria";
      alert(errorMsg);
    }
  });

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3 space-y-2">
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" {...register("nome", { required: "Nome é obrigatório" })} />
          {errors.nome && <p className="text-xs text-red-500">{errors.nome.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="emoji">Emoji</Label>
          <Input id="emoji" {...register("emoji")} className="text-center text-xl" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input id="slug" {...register("slug", { required: "Slug é obrigatório" })} placeholder="ex: laticinios" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ordem">Ordem</Label>
          <Input id="ordem" type="number" {...register("ordem_exibicao")} />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("ativa")} className="w-4 h-4 rounded border-slate-300" />
            <span className="text-sm font-medium">Ativa</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Salvando..." : "Salvar Categoria"}
        </Button>
      </div>
    </form>
  );
}
