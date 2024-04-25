import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

export default function AddShop() {
  const [shopName, setShopName] = useState("");
  const [shopLocation, setShopLocation] = useState("");

  const handleAddShop = async () => {
    try {
      await axios.post("http://localhost:3000/admin-dash/add-shop", {
        shopName,
        shopLocation,
      });
      console.log("Shop added successfully");
    } catch (error) {
      console.error("Error adding shop:", error);
    }
  };

  return (
    <div className="p-10 px-16 w-full">
      <h1 className="text-2xl">Add Shop</h1>

      <div>
        <Label>Shop Name</Label>
        <Input
          type="text"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          className="mt-3"
          placeholder="Enter shop name"
        />
      </div>

      <div className="mt-6">
        <Label>Shop Location</Label>
        <Input
          type="text"
          value={shopLocation}
          onChange={(e) => setShopLocation(e.target.value)}
          className="mt-3"
          placeholder="Enter shop location"
        />
      </div>

      <button
        className="bg-green-500 text-white px-4 py-2 mt-8 rounded-md"
        onClick={handleAddShop}
      >
        Add Shop
      </button>
    </div>
  );
}
