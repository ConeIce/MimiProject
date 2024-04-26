import AdminSidebar from "@/components/AdminSidebar";
import { Outlet } from "react-router-dom";

export default function AdminDashboard() {
  console.log("dash ran");
  return (
    <div className="flex">
      <AdminSidebar />
      <Outlet />
    </div>
  );
}
