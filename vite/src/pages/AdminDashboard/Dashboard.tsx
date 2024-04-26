import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/admin-dash/allshops",
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      setShops(response.data);
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  const handleAddShop = () => {
    navigate("/add-shop");
  };

  const handleSelectShop = (shop) => {
    // Implement logic to handle when a shop is selected
  };

  // Filter shops based on search term
  const filteredShops = shops.filter((shop) =>
    shop.shop_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Display only the first 5 shops
  const limitedShops = filteredShops.slice(0, 5);

  return (
    <div className="p-10 px-16 w-full">
      <h1 className="text-2xl">Shop Settings</h1>

      <div className="mt-4">
        <Label>Search Shop</Label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by shop name..."
          className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mt-1"
        />
      </div>

      <div>
        <Label>Shop Name (Limited to 5)</Label>
        <div className="flex flex-wrap gap-4 mt-3">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={handleAddShop}
          >
            Add Shop
          </button>
          {limitedShops.map((shop) => (
            <button
              key={shop.shop_id}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => handleSelectShop(shop)}
            >
              {shop.shop_name}
            </button>
          ))}
        </div>
      </div>

      <hr className="my-8 border-gray-300" />
    </div>
  );
}
