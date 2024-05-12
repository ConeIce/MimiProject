import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function AddShop() {
  const [shopName, setShopName] = useState("");
  const [shopLocation, setShopLocation] = useState("");
  const navigate = useNavigate();

  const handleAddShop = async () => {
    try {
      await axios.post(
        "http://localhost:3000/admin/addShop",
        {
          shopName,
          shopLocation,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Shop added successfully");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error adding shop:", error);
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

      <Button
        onClick={handleAddShop}
        className="bg-green-500 text-white px-4 py-2 rounded-md"
      >
        Add Shop
      </Button>
    </div>
  );
}
