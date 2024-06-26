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
      </div>
    </div>
  );
}
