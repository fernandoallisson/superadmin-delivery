import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import Login from "../../pages/auth/Login";
import Dashboard from "../../pages/dashboard/Dashboard";
import StoresList from "../../pages/stores/StoresList";
import StoreForm from "../../pages/stores/StoreForm";
import StoreDetails from "../../pages/stores/StoreDetails";
import UsuariosList from "../../pages/users/UsuariosList";
import UsuarioForm from "../../pages/users/UsuarioForm";
import UsuarioDetails from "../../pages/users/UsuarioDetails";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        
        {/* Lojas */}
        <Route path="stores" element={<StoresList />} />
        <Route path="stores/new" element={<StoreForm />} />
        <Route path="stores/:id" element={<StoreDetails />} />
        <Route path="stores/:id/edit" element={<StoreForm />} />
        
        {/* Usuários */}
        <Route path="users" element={<UsuariosList />} />
        <Route path="users/new" element={<UsuarioForm />} />
        <Route path="users/:id" element={<UsuarioDetails />} />
        <Route path="users/:id/edit" element={<UsuarioForm />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
