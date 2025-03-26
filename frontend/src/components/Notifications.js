import { useEffect, useState } from "react";
import axios from "axios";
import { Search, XCircle } from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null); // ✅ New state for modal

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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4 text-center text-blue-600">
        Notifications
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded flex items-center">
          <XCircle size={18} className="mr-2" /> {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full">
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

      {notifications.length === 0 ? (
        <p className="text-gray-600 text-center">No notifications available.</p>
      ) : (
        <table className="w-full border-collapse border rounded shadow-md bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Ref No.</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {notifications
              .filter((n) =>
                n.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((notification) => (
                <tr key={notification._id} className="text-center">
                  <td className="p-3 border">{notification.refNo || "NA"}</td>
                  <td className="p-3 border">
                    <button
                      className="text-blue-600 underline hover:text-blue-800 transition"
                      onClick={() => setSelectedNotification(notification)}
                    >
                      {notification.title}
                    </button>
                  </td>
                  <td className="p-3 border">
                    {new Date(notification.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {/* ✅ Notification Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {selectedNotification.title}
            </h2>
            <p className="text-gray-700">{selectedNotification.message}</p>
            <div className="text-center mt-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
                onClick={() => setSelectedNotification(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
