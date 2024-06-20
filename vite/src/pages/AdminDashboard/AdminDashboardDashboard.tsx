import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [usersAwaitingApproval, setUsersAwaitingApproval] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchShops();
    fetchUsersAwaitingApproval();
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

  const fetchUsersAwaitingApproval = async () => {
    try {
      const response = await axios.get("http://localhost:3000/admin/pending", {
        withCredentials: true,
      });
      console.log(response.data);
      setUsersAwaitingApproval(response.data.slice(0, 5));
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
        <h2 className="text-xl">Clients awaiting approval</h2>
        <div className="flex flex-wrap gap-4 mt-3">
          {usersAwaitingApproval.map((shop) => (
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

      {!usersAwaitingApproval.length && "Wait for client requests to arrive"}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">User Id</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Shop name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usersAwaitingApproval.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell className="font-medium">{user.user_id}</TableCell>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>{user.shop_name}</TableCell>
              <TableCell>Approval Pending</TableCell>
              <TableCell>
                <Button className="mr-5">Approve</Button>
                <Button className="bg-red-500">Reject</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
