import { useState, useEffect } from "react";
import axios from "axios";

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [currentNotification, setCurrentNotification] = useState({ title: "", message: "" });
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const API_URL = "https://api.example.com/notifications";

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setNotifications(data);
      setFilteredNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filtered = notifications.filter((n) =>
      n.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredNotifications(filtered);
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${currentNotification.id}`, currentNotification);
      } else {
        await axios.post(API_URL, currentNotification);
      }
      fetchNotifications();
      setShowDialog(false);
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Manage Notifications</h2>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search notifications..."
          value={search}
          onChange={handleSearch}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={() => {
            setIsEditing(false);
            setCurrentNotification({ title: "", message: "" });
            setShowDialog(true);
          }}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          + New Notification
        </button>
      </div>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Title</th>
            <th className="border p-2">Message</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredNotifications.map((notification) => (
            <tr key={notification.id} className="text-center">
              <td className="border p-2">{notification.title}</td>
              <td className="border p-2">{notification.message}</td>
              <td className="border p-2">{new Date(notification.date).toLocaleString()}</td>
              <td className="border p-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  onClick={() => {
                    setCurrentNotification(notification);
                    setIsEditing(true);
                    setShowDialog(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(notification.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">{isEditing ? "Edit" : "New"} Notification</h3>
            <input
              type="text"
              placeholder="Title"
              value={currentNotification.title}
              onChange={(e) => setCurrentNotification({ ...currentNotification, title: e.target.value })}
              className="border p-2 rounded w-full mb-2"
            />
            <textarea
              placeholder="Message"
              value={currentNotification.message}
              onChange={(e) => setCurrentNotification({ ...currentNotification, message: e.target.value })}
              className="border p-2 rounded w-full mb-2"
            ></textarea>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDialog(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">
                {isEditing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationManager;
