import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import VerifiedIcon from "@mui/icons-material/Verified";

const VerifyUpdatedEmail = () => {
    const { newEmail, userId } = useParams(); 

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/user/verify/${newEmail}/${userId}`
                );
                console.log("Verification successful:", response.data);
            } catch (error) {
                console.error("Error verifying email:", error);
            }
        };

        if (newEmail) verifyUser();
    }, [newEmail]);

    return (
        <div className="flex items-center justify-center h-screen bg-white text-black text-3xl">
            <div className="verify">
                <VerifiedIcon sx={{ fontSize: 195 }} />
            </div>
            <h2> Email Verified</h2>
        </div>
    );
};

export default VerifyUpdatedEmail;
