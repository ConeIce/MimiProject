import AdminSidebar from "@/components/AdminSidebar";
import { Outlet } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="flex">
      <AdminSidebar />
      <Outlet />
    </div>
  );
}
