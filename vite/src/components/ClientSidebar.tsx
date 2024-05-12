import { ChevronDown, LayoutDashboard, LogOut, Printer } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export default function ClientSidebar() {
  return (
    <div className="border-r h-screen pb-4 w-[350px] relative">
      <h1 className="px-8 py-6 text-2xl bg-black text-white font-light">
        Client Dashboard
      </h1>

      <div className="px-8">
        <h3 className="text-xl mt-8 mb-8">Menu</h3>

        <Link to="/client/dashboard/print">
          <Button
            variant="ghost"
            className="w-full mb-4 justify-start hover:bg-white"
          >
            <div className="bg-black mr-5 p-2 rounded-md">
              <Printer className="h-4 w-4 text-white" />
            </div>
            Print Queue
          </Button>
        </Link>
        <Link to="/client/dashboard/settings">
          <Button
            variant="ghost"
            className="w-full mb-4 justify-start hover:bg-white"
          >
            <div className="bg-black mr-5 p-2 rounded-md">
              <Printer className="h-4 w-4 text-white" />
            </div>
            Shop settings
          </Button>
        </Link>
      </div>
    </div>
  );
}
