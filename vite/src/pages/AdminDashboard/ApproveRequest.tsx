import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function PendingShopDetails() {
  const [shopDetails, setShopDetails] = useState(null);
  const location = useLocation();
  const shopId = new URLSearchParams(location.search).get("id");

  useEffect(() => {
    async function fetchShopDetails() {
      try {
        console.log(shopId);
        const response = await axios.get(
          `http://localhost:3000/admin/clientRequest/${shopId}`,
          {
            withCredentials: true,
          }
        );
        setShopDetails(response.data);
      } catch (error) {
        console.error("Error fetching shop details:", error);
      }
    }

    fetchShopDetails();
  }, [shopId]);

  const handleApprove = async (userId) => {
    console.log(userId);
    try {
      await axios.post(
        `http://localhost:3000/admin/approveClient`,
        { user_id: userId },
        { withCredentials: true }
      );
      setShopDetails((prevShopDetails) => ({
        ...prevShopDetails,
        users: prevShopDetails.users.filter((user) => user.user_id !== userId),
      }));
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
      setShopDetails((prevShopDetails) => ({
        ...prevShopDetails,
        users: prevShopDetails.users.filter((user) => user.user_id !== userId),
      }));
    } catch (error) {
      console.error("Error rejecting user:", error);
    }
  };

  if (!shopDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <h1 className="text-xl mr-4">{shopDetails.shop_name}</h1>
        <p className="text-gray-500">{shopDetails.shop_location}</p>
      </div>
      {shopDetails.users.length === 0 ? (
        <div>No pending requests</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {shopDetails.users.map((user) => (
            <div
              key={user.user_id}
              className="bg-gray-100 p-4 rounded-md flex items-center justify-between"
            >
              <div className="flex items-center">
                <img
                  src={user.profile_photo}
                  alt="Profile"
                  className="w-20 h-20 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <img
                src={user.proof_of_work}
                alt="Proof of Work"
                className="flex-shrink-0 rounded-md ml-4"
              />
              <div className="flex flex-col justify-center ml-4">
                <button
                  onClick={() => handleApprove(user.user_id)}
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
      )}
    </div>
  );
}
