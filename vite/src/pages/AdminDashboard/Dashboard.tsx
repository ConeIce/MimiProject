import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingShops, setPendingShops] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchShops();
    fetchPendingShops();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/admin-dash/searchShop?search=${searchTerm}`,
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

  const fetchPendingShops = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/admin-dash/pendingShops",
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      setPendingShops(response.data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching pending shops:", error);
    }
  };

  const handleAddShop = () => {
    navigate("/add-shop");
  };

  const handleSearch = () => {
    fetchShops();
  };

  const handleSelectShop = (id) => {
    navigate(`/approve-request?id=${id}`);
  };

  return (
    <div className="p-10 px-16 w-full">
      <h1 className="text-2xl">Shop Settings</h1>

      <div className="mt-4 flex items-center">
        <Label>Search Shop</Label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by shop name..."
          className="block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mt-1"
        />
        <button
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <div>
        <Label>Shop Name</Label>
        <div className="flex flex-wrap gap-4 mt-3">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={handleAddShop}
          >
            Add Shop
          </button>
        </div>
      </div>

      <hr className="my-8 border-gray-300" />

      <div>
        <h2 className="text-xl">Pending Approvals</h2>
        <div className="flex flex-wrap gap-4 mt-3">
          {pendingShops.map((shop) => (
            <button
              key={shop.shop_id}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md"
              onClick={() => handleSelectShop(shop.shop_id)}
            >
              {shop.shop_name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
