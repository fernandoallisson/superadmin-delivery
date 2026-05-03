import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Store, Bell, Truck, LogOut } from "lucide-react";

export default function DriverLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Minhas Entregas", path: "/driver", icon: Truck },
    { name: "Sair", path: "/login", icon: LogOut, action: handleLogout },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Topbar */}
      <header className="bg-[#122a4c] text-white px-4 h-16 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg shrink-0">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-white/60 leading-tight uppercase tracking-wider font-bold">
              São Jorge Super
            </span>
            <span className="text-sm font-semibold truncate">
              Olá, {user?.nome || "Entregador"}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs font-medium">Disponível</span>
          </div>
          <button className="relative p-2 hover:bg-white/10 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#122a4c]" />
          </button>
        </div>
      </header>

      {/* Faixa de turno (mobile only) */}
      <div className="sm:hidden bg-white border-b border-slate-200 px-4 py-2 shrink-0">
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          <span>Turno ativo · Disponível para rotas</span>
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto relative pb-20 sm:pb-0">
        <div className="max-w-3xl mx-auto min-h-full">
          <Outlet />
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center shrink-0 z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === "/driver" && location.pathname.startsWith("/driver/route"));
          const isLogout = item.name === "Sair";
          
          if (isLogout) {
            return (
              <button
                key={item.name}
                onClick={item.action}
                className="flex-1 flex flex-col items-center justify-center gap-1 text-slate-400"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium uppercase tracking-tighter">{item.name}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 flex flex-col items-center justify-center gap-1 ${
                isActive ? "text-[#122a4c]" : "text-slate-400"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium uppercase tracking-tighter">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
