import { useMetricas } from "../../hooks/useMetricas";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Store, Users, ShoppingCart, DollarSign, Package, Truck,
  TrendingUp, AlertTriangle, RefreshCw, Clock, CreditCard,
  BarChart3, ArrowUpRight, ArrowDownRight, Loader2, ShieldAlert,
  Ticket, Box, UserCheck
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "../../components/ui/button";

const COLORS = [
  "#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd",
  "#22d3ee", "#2dd4bf", "#34d399", "#4ade80",
  "#f59e0b", "#f97316", "#ef4444", "#ec4899",
];

function fmt(v: number | undefined) {
  if (v === undefined || v === null) return "R$ 0,00";
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function num(v: number | undefined) {
  if (v === undefined || v === null) return "0";
  return Number(v).toLocaleString("pt-BR");
}

function StatCard({ title, value, icon: Icon, sub, color = "text-primary", trend }: {
  title: string; value: string; icon: React.ElementType; sub?: string;
  color?: string; trend?: "up" | "down" | "neutral";
}) {
  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <div className={`absolute inset-0 opacity-[0.03] ${color.replace("text-", "bg-")}`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {sub && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            {trend === "up" && <ArrowUpRight className="h-3 w-3 text-emerald-500" />}
            {trend === "down" && <ArrowDownRight className="h-3 w-3 text-red-500" />}
            {sub}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: m, isLoading, error, refetch, isFetching } = useMetricas();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground text-sm">Carregando métricas...</p>
        </div>
      </div>
    );
  }

  if (error || !m) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <ShieldAlert className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-lg font-semibold">Erro ao carregar métricas</h2>
            <p className="text-sm text-muted-foreground">
              {(error as Error)?.message || "Verifique se o backend está rodando."}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" /> Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const r = m.resumo;
  const ped = m.pedidos.metricas;
  const fin = m.financeiro;

  // Prepare chart data
  const pedidosDia = [...(m.pedidos.ultimos_30_dias || [])].reverse().map(d => ({
    data: format(parseISO(d.data), "dd/MM", { locale: ptBR }),
    pedidos: d.quantidade,
    valor: Number(d.valor_total),
  }));

  const statusPedidos = [
    { name: "Pendentes", value: ped.pedidos_pendentes, color: "#f59e0b" },
    { name: "Confirmados", value: ped.pedidos_confirmados, color: "#6366f1" },
    { name: "Em Separação", value: ped.pedidos_em_separacao, color: "#8b5cf6" },
    { name: "Prontos", value: ped.pedidos_prontos, color: "#22d3ee" },
    { name: "Saiu p/ Entrega", value: ped.pedidos_saiu_entrega, color: "#2dd4bf" },
    { name: "Entregues", value: ped.pedidos_entregues, color: "#22c55e" },
    { name: "Cancelados", value: ped.pedidos_cancelados, color: "#ef4444" },
  ].filter(s => s.value > 0);

  const topLojas = (m.rankings.top_lojas_faturamento || []).slice(0, 5).map(l => ({
    nome: l.nome?.length > 18 ? l.nome.slice(0, 18) + "…" : l.nome,
    faturamento: Number(l.faturamento),
  }));

  const formasPg = (fin.formas_pagamento || []).map((f, i) => ({
    name: f.forma_pagamento || "N/A",
    value: Number(f.valor_total),
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Visão Geral da Plataforma</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Atualizado em {m.gerado_em ? format(parseISO(m.gerado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : "—"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Lojas Ativas" value={num(r.lojas_ativas)} icon={Store}
          sub={`${num(r.total_lojas)} total · ${num(r.lojas_inativas)} inativas`} color="text-indigo-500" />
        <StatCard title="Clientes Ativos" value={num(r.clientes_ativos)} icon={Users}
          sub={`${num(r.total_clientes)} total · ${num(r.clientes_bloqueados)} bloqueados`} color="text-cyan-500" />
        <StatCard title="Faturamento (Entregues)" value={fmt(ped.valor_pedidos_entregues)} icon={DollarSign}
          sub={`${fmt(ped.valor_total_pedidos)} em pedidos totais`} color="text-emerald-500" trend="up" />
        <StatCard title="Ticket Médio" value={fmt(ped.ticket_medio)} icon={TrendingUp}
          sub={`${num(ped.total_pedidos)} pedidos realizados`} color="text-violet-500" />
      </div>

      {/* KPI Cards Row 2 */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Pedidos Totais" value={num(ped.total_pedidos)} icon={ShoppingCart}
          sub={`${num(ped.pedidos_entregues)} entregues · ${num(ped.pedidos_cancelados)} cancelados`} color="text-blue-500" />
        <StatCard title="Produtos Ativos" value={num(r.produtos_ativos)} icon={Package}
          sub={`${num(r.total_produtos)} total · ${num(r.total_categorias)} categorias`} color="text-orange-500" />
        <StatCard title="Entregadores Ativos" value={num(r.entregadores_ativos)} icon={Truck}
          sub={`${num(r.total_entregadores)} cadastrados`} color="text-teal-500" />
        <StatCard title="Usuários do Sistema" value={num(r.usuarios_ativos)} icon={UserCheck}
          sub={`${num(r.total_usuarios)} total · ${num(r.total_users_sistema)} users auth`} color="text-pink-500" />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Orders last 30 days */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-primary" /> Pedidos — Últimos 30 Dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pedidosDia.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={pedidosDia}>
                  <defs>
                    <linearGradient id="colorPed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="data" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))" }} />
                  <Area type="monotone" dataKey="pedidos" stroke="#6366f1" fillOpacity={1} fill="url(#colorPed)" strokeWidth={2} name="Qtd Pedidos" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
                Nenhum pedido nos últimos 30 dias
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders by status */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-primary" /> Status dos Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusPedidos.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusPedidos} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    innerRadius={55} outerRadius={90} paddingAngle={3} label={({ name, value }) => `${name}: ${value}`}
                    labelLine={{ strokeWidth: 1 }} style={{ fontSize: 11 }}>
                    {statusPedidos.map((s, i) => <Cell key={i} fill={s.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
                Nenhum pedido registrado
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Financial + Top Stores Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Payment methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-4 w-4 text-primary" /> Formas de Pagamento (Aprovados)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {formasPg.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={formasPg} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    outerRadius={85} label={({ name }) => name} style={{ fontSize: 11 }}>
                    {formasPg.map((f, i) => <Cell key={i} fill={f.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => fmt(v)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
                Sem dados de pagamento
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top stores by revenue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" /> Top Lojas por Faturamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topLojas.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topLojas} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => fmt(v)} stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="category" dataKey="nome" width={120} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip formatter={(v: any) => fmt(v)} />
                  <Bar dataKey="faturamento" fill="#6366f1" radius={[0, 6, 6, 0]} name="Faturamento" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
                Sem dados de lojas
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Pagamentos Aprovados" value={fmt(fin.pagamentos.valor_total_aprovado)} icon={CreditCard}
          sub={`${num(fin.pagamentos.pagamentos_aprovados)} de ${num(fin.pagamentos.total_pagamentos)}`} color="text-emerald-500" trend="up" />
        <StatCard title="Valor Líquido" value={fmt(fin.pagamentos.valor_liquido_total)} icon={DollarSign}
          sub={`Taxas gateway: ${fmt(fin.pagamentos.total_taxas_gateway)}`} color="text-green-500" />
        <StatCard title="Estornos" value={fmt(fin.estornos.valor_total_estornado)} icon={RefreshCw}
          sub={`${num(fin.estornos.estornos_aprovados)} aprovados · ${num(fin.estornos.estornos_pendentes)} pendentes`}
          color="text-amber-500" trend={fin.estornos.total_estornos > 0 ? "down" : "neutral"} />
        <StatCard title="Splits Transferidos" value={fmt(fin.splits.valor_liquido_transferido)} icon={ArrowUpRight}
          sub={`${num(fin.splits.splits_transferidos)} de ${num(fin.splits.total_splits)} · ${num(fin.splits.splits_pendentes)} pendentes`}
          color="text-indigo-500" />
      </div>

      {/* Entregas + Estoque + Carrinhos + Cupons */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Truck className="h-4 w-4 text-teal-500" /> Entregas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-semibold">{num(m.entregas.total_entregas)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Aguardando</span><span className="text-amber-500 font-medium">{num(m.entregas.entregas_aguardando)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Em Andamento</span><span className="text-blue-500 font-medium">{num(m.entregas.entregas_em_andamento)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Concluídas</span><span className="text-emerald-500 font-medium">{num(m.entregas.entregas_concluidas)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Falhas</span><span className="text-red-500 font-medium">{num(m.entregas.entregas_falharam)}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Box className="h-4 w-4 text-orange-500" /> Estoque
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Registros</span><span className="font-semibold">{num(m.estoque.total_registros_estoque)}</span></div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estoque Baixo</span>
              <span className={`font-medium ${m.estoque.produtos_estoque_baixo > 0 ? "text-amber-500" : ""}`}>{num(m.estoque.produtos_estoque_baixo)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sem Estoque</span>
              <span className={`font-medium ${m.estoque.produtos_sem_estoque > 0 ? "text-red-500" : ""}`}>{num(m.estoque.produtos_sem_estoque)}</span>
            </div>
            <div className="flex justify-between"><span className="text-muted-foreground">Reservados</span><span className="font-medium">{num(m.estoque.total_quantidade_reservada)}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-violet-500" /> Carrinhos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-semibold">{num(m.carrinhos.total_carrinhos)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Ativos</span><span className="text-blue-500 font-medium">{num(m.carrinhos.carrinhos_ativos)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Convertidos</span><span className="text-emerald-500 font-medium">{num(m.carrinhos.carrinhos_convertidos)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Abandonados</span><span className="text-red-500 font-medium">{num(m.carrinhos.carrinhos_abandonados)}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Ticket className="h-4 w-4 text-pink-500" /> Cupons & Auditoria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Cupons Ativos</span><span className="font-semibold">{num(r.cupons_ativos)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Usos de Cupom</span><span className="font-medium">{num(m.cupons.total_usos)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Logs Auditoria</span><span className="font-medium">{num(m.auditoria.total_logs)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Webhooks</span>
              <span className="font-medium">
                {num(fin.webhooks.processadas)}/{num(fin.webhooks.total_notificacoes)}
                {fin.webhooks.com_erro > 0 && <span className="text-red-500 ml-1">({fin.webhooks.com_erro} erros)</span>}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(m.estoque.produtos_sem_estoque > 0 || fin.webhooks.com_erro > 0 || fin.pagamentos.pagamentos_rejeitados > 0) && (
        <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" /> Alertas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {m.estoque.produtos_sem_estoque > 0 && (
              <p className="text-amber-700 dark:text-amber-400">⚠️ {m.estoque.produtos_sem_estoque} produto(s) sem estoque</p>
            )}
            {fin.webhooks.com_erro > 0 && (
              <p className="text-amber-700 dark:text-amber-400">⚠️ {fin.webhooks.com_erro} webhook(s) com erro de processamento</p>
            )}
            {fin.pagamentos.pagamentos_rejeitados > 0 && (
              <p className="text-amber-700 dark:text-amber-400">⚠️ {fin.pagamentos.pagamentos_rejeitados} pagamento(s) rejeitado(s)</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
