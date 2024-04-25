import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

export default function Dashboard() {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/admin-dash/allshops"
      );
      console.log(response.data);
      setShops(response.data);
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  const handleAddShop = () => {
    // Implement logic to add a new shop
  };

  return (
    <div className="p-10 px-16 w-full">
      <h1 className="text-2xl">Shop Settings</h1>

      <div>
        <Label>Shop Name</Label>
        <div className="flex flex-wrap gap-4 mt-3">
          {shops.map((shop) => (
            <button
              key={shop.shop_id}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => handleSelectShop(shop)}
            >
              {shop.shop_name}
            </button>
          ))}
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={handleAddShop}
          >
            Add Shop
          </button>
        </div>
      </div>

      <h1 className="text-2xl mt-8">Shop summary</h1>

      <div className="flex gap-8">
        <div className="bg-black text-white text-2xl font-bold p-8 rounded-md">
          45 Total Prints
        </div>
        <div className="bg-black text-white text-2xl font-bold p-8 rounded-md">
          35 Prints Pending
        </div>
        <div className="bg-black text-white text-2xl font-bold p-8 rounded-md">
          $3000 in Profits
        </div>
      </div>
    </div>
  );
}
