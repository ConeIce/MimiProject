import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

export default function Shop() {
  const [shopDetails, setShopDetails] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [shopUsers, setShopUsers] = useState([]);
  const location = useLocation();
  const shopId = new URLSearchParams(location.search).get("id");

  useEffect(() => {
    fetchShopDetails();
    fetchPendingRequests();
    // fetchShopUsers();
  }, []);

  const handleApprove = async (userId, shopId) => {
    try {
      await axios.post(
        `http://localhost:3000/admin/approveClient`,
        { user_id: userId, shop_id: shopId },
        { withCredentials: true }
      );
      setPendingRequests((prevShopDetails) => {
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
      setPendingRequests((prevShopDetails) => {
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
    try {
      const response = await axios.get(
        `http://localhost:3000/admin/clientRequest/${shopId}`,
        { withCredentials: true }
      );
      console.log(response.data);
      setPendingRequests(response.data);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };

  //   const fetchShopUsers = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:3000/shop/shopUsers/${shopId}`,
  //         { withCredentials: true }
  //       );
  //       setShopUsers(response.data);
  //     } catch (error) {
  //       console.error("Error fetching shop users:", error);
  //     }
  //   };

  if (!shopDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-10 px-16 w-full">
      <div>
        <h2 className="text-2xl mb-4">{shopDetails.shop_name}</h2>
        <p className="text-lg mb-8">{shopDetails.shop_location}</p>

        <h3 className="text-xl mb-4">Pending Requests</h3>
        <div className="grid grid-cols-2 gap-4">
          {pendingRequests.users &&
            pendingRequests.users.length > 0 &&
            pendingRequests.users.map((user) => (
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
        {/* <div className="flex flex-wrap gap-4 mt-3">
          {shopUsers.map((user) => (
            <div
              key={user.id}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              {user.name}
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}
