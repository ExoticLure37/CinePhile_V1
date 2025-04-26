import { useNavigate } from "react-router-dom";

export default function LogOut() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove authentication token
    navigate("/signin"); // Redirect to login page
  };

  return (
    <div className="flex flex-col mx-auto">
      <div>
        <span>Are You sure you want to Log Out</span>
      </div>
      <div className="flex align-middle justify-center mt-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
