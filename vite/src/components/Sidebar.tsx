import { LayoutDashboard, Printer, Settings, User } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="border-r h-screen p-8">
      <h1 className="text-2xl font-semibold mb-5">PrintConnect</h1>

      <h3 className="mb-3">Menu</h3>

      <Link to="/dashboard/print">
        <Button variant="ghost" className="w-full mb-2 justify-start">
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
      </Link>

      <Link to="/dashboard/all">
        <Button variant="ghost" className="w-full mb-4 justify-start">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
      </Link>

      <h3 className="mb-3">Others</h3>

      <Button variant="ghost" className="w-full mb-2 justify-start">
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </Button>
      <Button variant="ghost" className="w-full mb-2 justify-start">
        <User className="mr-2 h-4 w-4" />
        Profile
      </Button>
    </div>
  );
}
