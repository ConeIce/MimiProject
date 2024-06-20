import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";

export default function Shop() {
  const [shopDetails, setShopDetails] = useState(null);
  const [usersAwaitingApproval, setUsersAwaitingApproval] = useState([]);
  const [shopUsers, setShopUsers] = useState([]);
  const location = useLocation();
  const shopId = new URLSearchParams(location.search).get("id");
  const navigate = useNavigate();

  useEffect(() => {
    fetchShopDetails();
    fetchPendingRequests();
    fetchShopUsers();
  }, []);

  const handleApprove = async (userId, shopId) => {
    try {
      await axios.post(
        `http://localhost:3000/admin/approveClient`,
        { user_id: userId, shop_id: shopId },
        { withCredentials: true }
      );
      setUsersAwaitingApproval((prevShopDetails) => {
        return prevShopDetails.filter((user) => user.user_id !== userId);
      });

      setShopUsers((prevShopUsers) => {
        return [
          ...prevShopUsers,
          usersAwaitingApproval.find((user) => user.user_id === userId),
        ];
      });
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.post(
        `http://localhost:3000/admin/rejectClient`,
        { user_id: userId },
        { withCredentials: true }
      );
      setUsersAwaitingApproval((prevShopDetails) => {
        if (!prevShopDetails.users || !Array.isArray(prevShopDetails.users)) {
          return prevShopDetails;
        }

        return {
          ...prevShopDetails,
          users: prevShopDetails.users.filter(
            (user) => user.user_id !== userId
          ),
        };
      });
    } catch (error) {
      console.error("Error rejecting user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/admin/deleteClient`,
        { user_id: userId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setShopUsers((prevShopUsers) =>
          prevShopUsers.filter((user) => user.user_id !== userId)
        );
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeleteShop = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/admin/deleteShop/${shopId}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        navigate("/admin/dashboard");
      } else {
        console.error("Failed to delete shop");
      }
    } catch (error) {
      console.error("Error deleting shop:", error);
    }
  };

  const fetchShopDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/shop/shopById/${shopId}`,
        { withCredentials: true }
      );
      setShopDetails(response.data);
      console.log(shopDetails);
    } catch (error) {
      console.error("Error fetching shop details:", error);
    }
  };

  const fetchPendingRequests = async () => {
    console.log("Hey there");
    try {
      const response = await axios.get(
        `http://localhost:3000/admin/pending/${shopId}`,
        { withCredentials: true }
      );
      console.log(response.data);
      setUsersAwaitingApproval(response.data);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };

  const fetchShopUsers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/shop/users/${shopId}`,
        { withCredentials: true }
      );
      setShopUsers(response.data);
      console.log(shopUsers);
    } catch (error) {
      console.error("Error fetching shop users:", error);
    }
  };

  if (!shopDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-10 px-16 w-full">
      <div>
        <h2 className="text-2xl mb-4">{shopDetails.shop_name}</h2>
        <p className="text-lg mb-8">{shopDetails.shop_location}</p>
        <h3 className="text-xl mb-4">Pending Requests</h3>{" "}
        {!usersAwaitingApproval.length && "Wait for client requests to arrive"}
        <div className="grid grid-cols-2 gap-4">
          {usersAwaitingApproval &&
            usersAwaitingApproval.map((user) => (
              <div
                key={user.user_id}
                className="bg-gray-100 p-4 rounded-md flex"
              >
                <div className="flex flex-col items-center mr-4">
                  <img
                    src={user.profile_photo}
                    alt="Profile"
                    className="w-20 h-20 rounded-full mb-2"
                  />
                  <p className="text-center font-semibold">{user.username}</p>
                  <p className="text-center text-gray-500">{user.email}</p>
                </div>
                <img
                  src={user.proof_of_work}
                  alt="Proof of Work"
                  className="flex-shrink-0 rounded-md"
                />
                <div className="flex flex-col justify-center ml-4">
                  <button
                    onClick={() =>
                      handleApprove(user.user_id, shopDetails.shop_id)
                    }
                    className="bg-green-500 text-white px-4 py-2 rounded-md mb-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(user.user_id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
        </div>
        <h3 className="text-xl my-8">Shop Users</h3>
        <div className="flex flex-wrap gap-4 mt-3">
          {shopUsers.map((user) => (
            <div
              key={user.user_id}
              className="bg-green-500 text-white p-4 rounded-md flex items-center"
            >
              <img
                src={user.personal_photo}
                alt="Profile"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="font-semibold">{user.username}</p>
                <p className="text-gray-300">{user.email}</p>
              </div>
              <button
                onClick={() => handleDeleteUser(user.user_id)}
                className="bg-red-500 text-white px-4 py-2 ml-auto rounded-md"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">User Id</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shopUsers.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell className="font-medium">{user.user_id}</TableCell>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>Approved</TableCell>
                <TableCell>
                  <Button className="mr-5">Delete user</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-8">
          <button
            onClick={handleDeleteShop}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete Shop
          </button>
        </div>
      </div>
    </div>
  );
}
