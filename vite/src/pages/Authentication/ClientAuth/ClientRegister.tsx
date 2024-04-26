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

export default function ClientRegister() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the client secret is correct
    if (clientSecret !== "sambar") {
      toast({
        title: "Invalid client secret",
        description:
          "Please enter the correct client secret to register as a client",
      });
      return; // Prevent registration if client secret is incorrect
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        {
          username,
          email,
          password,
          role: "client",
        },
        { withCredentials: true }
      );

      toast({
        title: "Registration successful",
        description: `Welcome ${username}`,
      });

      // Redirect to client login page
      navigate("/client-login");
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
          <CardDescription>Register a new client</CardDescription>
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
                <Label htmlFor="framework">Client Secret</Label>
                <Input
                  placeholder="Client secret"
                  type="password"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link to="/client-login">
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
