import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        {
          username,
          password,
          role: "admin",
        },
        {
          withCredentials: true,
        }
      );
      console.log(response.data);

      navigate("/admin/dashboard");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast({
            title: "Oops. Error 400.",
            description: error.response.data,
          });
        } else if (error.response.status === 500) {
          toast({
            title: "Oops. Error 500. Not your fault",
            description: error.response.data,
          });
        } else {
          toast({
            title: `Oops. Error ${error.response.status}`,
            description: error.response.data,
          });
        }
      }

      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-login bg-no-repeat bg-center bg-cover">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login to admin dashboard</CardTitle>
          <CardDescription>Access the admin dashboard.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Username</Label>
                <Input
                  placeholder="Your username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    placeholder="Your password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link to="/admin/register">
              <Button type="button" variant="outline">
                Register new admin
              </Button>
            </Link>
            <Button type="submit">Login</Button>
          </CardFooter>
        </form>
      </Card>
      <Toaster />
    </div>
  );
}
