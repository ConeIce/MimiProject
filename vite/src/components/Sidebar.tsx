import { LayoutDashboard, Mail, Printer, Settings, User } from "lucide-react";
import { Button } from "./ui/button";

export default function Sidebar() {
  return (
    <div className="border-r-2 h-screen">
      <h1 className="text-2xl">PrintConnect</h1>

      <h3>Menu</h3>

      <Button>
        <Printer className="mr-2 h-4 w-4" /> Print
      </Button>
      <Button>
        <LayoutDashboard className="mr-2 h-4 w-4" />
        Dashboard
      </Button>

      <h3>Others</h3>

      <Button>
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </Button>
      <Button>
        <User className="mr-2 h-4 w-4" />
        Profile
      </Button>
    </div>
  );
}
