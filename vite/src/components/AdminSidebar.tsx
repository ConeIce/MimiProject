import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Printer,
  Settings,
  User,
} from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuShortcut } from "./ui/dropdown-menu";

export default function AdminSidebar() {
  return (
    <div className="border-r h-screen">
      <div className="flex justify-between items-center border-b-2 p-2 px-8">
        <Avatar className="mr-4">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <span className="mr-8">John Doe</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="icon">
              <ChevronDown />
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
