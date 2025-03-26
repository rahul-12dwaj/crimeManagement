import { useEffect, useState } from "react";
import axios from "axios";
import { Search, XCircle } from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/notification/existing-notification`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data.notifications);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch notifications");
    }
  };


  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center text-blue-600">Manage Notifications</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded flex items-center">
          <XCircle size={18} className="mr-2" /> {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notifications..."
            className="w-full p-2 border rounded pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3 text-gray-500" size={16} />
        </div>
      </div>

      <table className="w-full border-collapse border rounded shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border">Ref No.</th>
            <th className="p-3 border">Title</th>
            <th className="p-3 border">Date</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications
            .filter((n) => n.message.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((notification) => (
              <tr key={notification._id} className="text-center">
                <td className="p-3 border">{notification.refNo || "NA"}</td>
                <td className="p-3 border">{notification.title}</td>
                <td className="p-3 border">{new Date(notification.createdAt).toLocaleString()}</td>
                <td className="p-3 border">
                </td>
              </tr>
            ))}
        </tbody>
      </table>

    </div>
  );
};

export default Notifications;
