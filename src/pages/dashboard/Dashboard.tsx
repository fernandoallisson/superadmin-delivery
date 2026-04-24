import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Store, Users, DollarSign, Activity } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { title: "Total de Lojas", value: "124", icon: Store, description: "+4 neste mês" },
    { title: "Usuários Ativos", value: "1,205", icon: Users, description: "+12% em relação a ontem" },
    { title: "Vendas (Mês)", value: "R$ 45.231,89", icon: DollarSign, description: "+8% do mês anterior" },
    { title: "Pedidos (Hoje)", value: "573", icon: Activity, description: "+201 desde a última hora" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Aqui você pode adicionar gráficos ou tabelas recentes depois */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral de Pedidos</CardTitle>
          </CardHeader>
          <CardContent className="pl-2 flex justify-center items-center h-[300px] text-muted-foreground">
            Gráfico de pedidos virá aqui
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Lojas Recentes</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[300px] text-muted-foreground">
            Lista de lojas recentes virá aqui
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
