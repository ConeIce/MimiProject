import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function AddShop() {
  const [shopName, setShopName] = useState("");
  const [shopLocation, setShopLocation] = useState("");
  const [shopEmail, setShopEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddShop = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/admin/addShop",
        {
          shopName,
          shopLocation,
          shopEmail,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Shop added successfully");
      navigate("/admin/dashboard");
      toast({
        title: "Shop Added",
        description: "Shop has been added successfully",
        status: "success",
      });
    } catch (error) {
      console.error("Error adding shop:", error);
      toast({
        title: "Error",
        description: "Failed to add shop. Please try again later.",
        status: "error",
      });
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl mb-8">Add Shop</h2>

      <div className="mb-6">
        <Label>Shop Name</Label>
        <Input
          type="text"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          className="mt-3"
          placeholder="Enter shop name"
        />
      </div>

      <div className="mb-6">
        <Label>Shop Location</Label>
        <Input
          type="text"
          value={shopLocation}
          onChange={(e) => setShopLocation(e.target.value)}
          className="mt-3"
          placeholder="Enter shop location"
        />
      </div>

      <div className="mb-6">
        <Label>Shop Email</Label>
        <Input
          type="email"
          value={shopEmail}
          onChange={(e) => setShopEmail(e.target.value)}
          className="mt-3"
          placeholder="Enter shop email"
        />
      </div>

      <Button
        onClick={handleAddShop}
        className="bg-green-500 text-white px-4 py-2 rounded-md"
      >
        Add Shop
      </Button>
    </div>
  );
}
