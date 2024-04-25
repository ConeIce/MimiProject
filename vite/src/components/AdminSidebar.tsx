import { ChevronDown, LayoutDashboard, LogOut, Printer } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function AdminSidebar() {
  return (
    <div className="border-r h-screen pb-4 w-[350px] relative">
      <h1 className="px-8 py-6 text-2xl bg-black text-white font-light">
        Admin Dashboard
      </h1>

      <div className="px-8">
        <h3 className="text-xl mt-8 mb-8">Menu</h3>

        <Link to="/admin/dashboard">
          <Button
            variant="ghost"
            className="w-full mb-4 justify-start hover:bg-white"
          >
            <div className="bg-black mr-5 p-2 rounded-md">
              <LayoutDashboard className=" h-4 w-4 text-white" />
            </div>
            Dashboard
          </Button>
        </Link>

        <Link to="/admin/dashboard/print">
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

        <Link to="/admin/dashboard/print">
          <Button
            variant="ghost"
            className="w-full mb-4 justify-start hover:bg-white"
          >
            <div className="bg-black mr-5 p-2 rounded-md">
              <Printer className="h-4 w-4 text-white" />
            </div>
            Available Printers
          </Button>
        </Link>

        <Link to="/admin/dashboard/settings">
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

      <div className="w-full flex px-8 py-3 justify-between items-center absolute bottom-0 bg-green bg-pixel bg-center bg-cover">
        <span className="mr-8 font-semibold text-white">John Doe</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="icon">
              <ChevronDown className="text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
