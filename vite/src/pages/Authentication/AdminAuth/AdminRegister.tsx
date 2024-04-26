import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
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

export default function AdminRegister() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const navigate = useNavigate();

  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (adminSecret !== "kuboos") {
      toast({
        title: "Invalid admin secret",
        description:
          "Please enter the correct admin secret to register as admin",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        {
          username,
          email,
          password,
          role: "admin",
        },
        { withCredentials: true }
      );

      toast({
        title: "Registration successful",
        description: `Welcome ${username}`,
      });

      navigate("/admin-login");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast({
            title: "Oops. Error 400.",
            description: error.response.data,
          });
        }

        if (error.response.status === 500) {
          toast({
            title: "Oops. Error 500. Not your fault",
            description: error.response.data,
          });
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-login bg-no-repeat bg-center bg-cover">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Register a new admin</CardDescription>
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
                <Label htmlFor="framework">Email</Label>
                <Input
                  placeholder="Your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Password</Label>
                <Input
                  placeholder="Your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Admin Secret</Label>
                <Input
                  placeholder="Admin secret"
                  type="password"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link to="/admin-login">
              <Button variant="outline">Have an account? Login</Button>
            </Link>
            <Button type="submit">Register</Button>
          </CardFooter>
        </form>
      </Card>
      <Toaster />
    </div>
  );
}
