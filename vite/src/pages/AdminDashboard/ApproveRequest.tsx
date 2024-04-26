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
        const response = await axios.get(
          `http://localhost:3000/admin-dash/clientRequest/${shopId}`,
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

  if (!shopDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{shopDetails.shop_name}</h1>
      <p>Username: {shopDetails.username}</p>
      <p>Email: {shopDetails.email}</p>
      <p>Shop Location: {shopDetails.shop_location}</p>
      <img src={shopDetails.personal_photo} alt="Personal Photo" />
      <img src={shopDetails.proof_of_work} alt="Proof of Work Photo" />
    </div>
  );
}
