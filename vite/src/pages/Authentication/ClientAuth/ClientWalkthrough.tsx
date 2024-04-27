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

export default function ClientWalkthrough() {
  const [shopName, setShopName] = useState("");
  const [shopLocation, setShopLocation] = useState("");
  const [shopsExist, setShopsExist] = useState(false);
  const [shopsList, setShopsList] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [personalPhoto, setPersonalPhoto] = useState(null);
  const [proofOfWork, setProofOfWork] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkShopsExistence();
    fetchShopsList();
  }, []);

  const checkShopsExistence = async () => {
    try {
      const response = await axios.get("http://localhost:3000/shop/all", {
        withCredentials: true,
      });
      console.log(response.data);
      if (response.data.length > 0) {
        setShopsExist(true);
      }
    } catch (error) {
      console.error("Error checking shop existence:", error);
    }
  };

  const fetchShopsList = async () => {
    try {
      const response = await axios.get("http://localhost:3000/shop/all", {
        withCredentials: true,
      });
      setShopsList(response.data);
    } catch (error) {
      console.error("Error fetching shops list:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!personalPhoto || !proofOfWork) {
      toast({
        title: "Proof of work required",
        description:
          "Please upload both personal photo and proof of work photo.",
      });
      return;
    }

    console.log(personalPhoto);
    console.log(proofOfWork);

    try {
      const formData = new FormData();
      formData.append("shopId", selectedShop);
      formData.append("personalPhoto", personalPhoto);
      formData.append("proofOfWork", proofOfWork);

      const response = await axios.post(
        "http://localhost:3000/client/submitProof",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      navigate("/client/dashboard");
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

  return (
    <div className="flex items-center justify-center h-screen bg-login bg-no-repeat bg-center bg-cover">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Add Shop</CardTitle>
          <CardDescription>Add a new shop with proof of work</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="shop">Select Shop</Label>
                <select
                  id="shop"
                  value={selectedShop}
                  onChange={(e) => setSelectedShop(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select a shop
                  </option>
                  {shopsList.map((shop, index) => (
                    <option key={index} value={shop.shop_id}>
                      {shop.shop_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="photo">Personal Photo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPersonalPhoto(e.target.files[0])}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="proof-of-work">Proof of Work</Label>
                <Input
                  id="proof-of-work"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProofOfWork(e.target.files[0])}
                  required
                />
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
}
