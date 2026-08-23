import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import VerifiedIcon from "@mui/icons-material/Verified";

const VerifyEmail = () => {
  const { token } = useParams(); // Get token from URL

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/user/verify/${token}`,
        );
        console.log("Verification successful:", response.data);
      } catch (error) {
        console.error("Error verifying token:", error);
      }
    };

    if (token) verifyUser();
  }, [token]);

  return (
    <div className="flex items-center justify-center h-screen bg-white text-black text-3xl">
      <div className="verify">
        <VerifiedIcon sx={{ fontSize: 195 }} />
      </div>
      <h2> Email Verified</h2>
    </div>
  );
};

export default VerifyEmail;
