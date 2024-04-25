import { useState, useEffect } from "react";
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

export default function AdminWalkthrough() {
  const [shopName, setShopName] = useState("");
  const [shopsExist, setShopsExist] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkShopsExistence();
  }, []);

  const checkShopsExistence = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/admin-dash/shops"
      );
      if (response.data.length > 0) {
        setShopsExist(true);
      }
    } catch (error) {
      console.error("Error checking shop existence:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/admin/shop",
        {
          shopName,
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
        }

        if (error.response.status === 500) {
          toast({
            title: "Oops. Error 500. Not your fault",
            description: error.response.data,
          });
        }
      }

      console.error("Error logging in:", error);
    }
  };

  if (!shopsExist) {
    return (
      <div className="flex items-center justify-center h-screen bg-login bg-no-repeat bg-center bg-cover">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="mb-3">
              Add your first shop name to get started
            </CardTitle>
            <CardDescription>
              Your shop will be visible to users by this name
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Shop Name</Label>
                  <Input
                    placeholder="Your shop name"
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    required
                  />
                  <p className="text-sm text-slate-600 mt-3">
                    This can be changed at any time
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="submit">Save</Button>
            </CardFooter>
          </form>
        </Card>
        <Toaster />
      </div>
    );
  } else {
    navigate("/admin-dashboard");
    return null;
  }
}
