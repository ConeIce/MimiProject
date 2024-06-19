import ClientSidebar from "@/components/ClientSidebar";
import { Outlet } from "react-router-dom";

export default function ClientDashboard() {
  return (
    <div className="flex">
      <ClientSidebar />
      <Outlet />
    </div>
  );
}
