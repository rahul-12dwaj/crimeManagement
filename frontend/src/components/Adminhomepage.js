import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../adminComponents/AdminNavbar"
import AdminSidebar from "../adminComponents/AdminSidebar";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Adminhomepage = () => {
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {


          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch user");

        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user)); // Save user again
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    };

    fetchUserData();
  }, [setUser]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar at the Top */}
      <AdminNavbar />

      {/* Sidebar & Content Below Navbar */}
      <div className="flex flex-grow mt-20">
        {/* Fixed Sidebar */}
        <div className="flex flex-col fixed top-20 left-0 w-64 bg-white shadow-md h-full">
          {/* Sidebar content */}
          <AdminSidebar />
          {/* Log out button at the bottom */}
          <button className="mt-auto bg-red-500 text-white py-2 px-4 rounded-full mb-4 mx-auto">
            Log Out
          </button>
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-1 bg-gray-100 p-4 ml-64 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Adminhomepage;
