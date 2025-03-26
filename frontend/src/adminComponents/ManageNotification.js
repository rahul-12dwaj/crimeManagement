import { useEffect, useState } from "react";
import axios from "axios";
import { Trash, Search, PlusCircle } from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ManageNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [newTitle, setNewTitle] = useState(""); // ✅ Fix: Add missing state
  const [newReferenceNo, setNewReferenceNo] = useState(""); // ✅ Fix: Add missing state
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/notification/existing-notification`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error.response?.data?.message || error.message);
    }
  };

  const handleDeleteStart = (id) => {
    setDeleteId(id);
    setShowDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/notification/delete-notification/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter((notification) => notification._id !== deleteId));
      setShowDialog(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting notification:", error.response?.data?.message || error.message);
    }
  };

  const handleAddNotification = async () => {
    if (!newTitle.trim() || !newMessage.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/notification/add`,
        { title: newTitle, message: newMessage, refNo: newReferenceNo || "NA" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications([...notifications, response.data.notification]);
      setShowAddDialog(false);
      setNewTitle(""); // ✅ Reset title input
      setNewMessage(""); // ✅ Reset message input
      setNewReferenceNo(""); // ✅ Reset reference number input
    } catch (error) {
      console.error("Error adding notification:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center text-blue-600">Manage Notifications</h1>
      
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
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded"
        >
          <PlusCircle size={16} className="mr-2" /> Add Notification
        </button>
      </div>

      <table className="w-full border-collapse border rounded shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border">Ref No.</th>
            <th className="p-3 border">Message</th>
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
                <td className="p-3 border">{notification.message}</td>
                <td className="p-3 border">{new Date(notification.createdAt).toLocaleString()}</td>
                <td className="p-3 border">
                  <button
                    onClick={() => handleDeleteStart(notification._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded flex items-center"
                  >
                    <Trash size={14} className="mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded shadow-lg">
            <p className="text-lg font-semibold mb-4">Confirm delete?</p>
            <div className="flex justify-between">
              <button onClick={() => setShowDialog(false)} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
              <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-500 text-white rounded">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Add Notification</h2>

            <input
              type="text"
              placeholder="Enter notification title..."
              className="w-full p-2 border rounded mb-2"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <input
              type="text"
              placeholder="Enter notification message..."
              className="w-full p-2 border rounded mb-2"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />

            <input
              type="text"
              placeholder="Enter reference number (optional)..."
              className="w-full p-2 border rounded mb-2"
              value={newReferenceNo}
              onChange={(e) => setNewReferenceNo(e.target.value)}
            />

            <div className="flex justify-between">
              <button onClick={() => setShowAddDialog(false)} className="px-4 py-2 bg-gray-500 text-white rounded">
                Cancel
              </button>
              <button onClick={handleAddNotification} className="px-4 py-2 bg-green-500 text-white rounded">
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageNotification;
