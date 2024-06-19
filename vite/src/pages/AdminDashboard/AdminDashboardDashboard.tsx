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
        `http://localhost:3000/shop/searchShop?search=${searchTerm}`,
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
        "http://localhost:3000/admin/pendingShops",
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
    navigate("/admin/dashboard/addShop");
  };

  const handleSearch = () => {
    fetchShops();
  };

  const handleSelectShop = (id) => {
    navigate(`/admin/dashboard/shop?id=${id}`);
  };

  return (
    <div className="p-10 px-16 w-full">
      <div className="mb-4">
        <Label>Search Shop</Label>
        <div className="flex bg-gray-200 border border-gray-300 rounded-md mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search shop by name..."
            className="flex-grow px-4 py-2 focus:outline-none"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      <div className="mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md"
          onClick={handleAddShop}
        >
          Add Shop
        </button>
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

      <hr className="my-8 border-gray-300" />

      <div className="mt-8">
        <h2 className="text-xl">Search Results</h2>
        <div className="mt-3">
          {shops.map((shop) => (
            <button
              key={shop.shop_id}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md mr-4 mb-4"
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
