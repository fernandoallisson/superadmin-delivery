import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import Login from "../../pages/auth/Login";
import Dashboard from "../../pages/dashboard/Dashboard";
import StoresList from "../../pages/stores/StoresList";
import StoreForm from "../../pages/stores/StoreForm";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        
        <Route path="stores" element={<StoresList />} />
        <Route path="stores/new" element={<StoreForm />} />
        <Route path="stores/:id/edit" element={<StoreForm />} />
        
        <Route path="users" element={<div>Listagem de Usuários</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
