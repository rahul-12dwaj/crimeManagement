import { useEffect, useState } from "react";
import axios from "axios";
import { Trash, Search, PlusCircle, XCircle } from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ManageNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newReferenceNo, setNewReferenceNo] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null); 

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

  const handleDeleteStart = (id) => {
    setDeleteId(id);
    setShowDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/notification/delete-notification/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter((notification) => notification._id !== deleteId));
      setShowDialog(false);
      setDeleteId(null);
    } catch (error) {
      setError(error.response?.data?.message || "Error deleting notification");
    }
  };

  const handleAddNotification = async () => {
    if (!newTitle.trim() || !newMessage.trim() || !newReferenceNo.trim()) {
      setError("Title, message & reference no. are required.");
      return;
    }
    try {
      setError(null);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/notification/add`,
        { title: newTitle, message: newMessage, refNo: newReferenceNo || "NA" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications([...notifications, response.data.notification]);
      setShowAddDialog(false);
      setNewTitle("");
      setNewMessage("");
      setNewReferenceNo("");
    } catch (error) {
      setError(error.response?.data?.message || "Error adding notification");
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
                <td className="p-3 border">
                    <button
                      className="text-blue-600 underline hover:text-blue-800 transition"
                      onClick={() => setSelectedNotification(notification)}
                    >
                      {notification.title}
                    </button>
                  </td>
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
              placeholder="Enter reference number..."
              className="w-full p-2 border rounded mb-2"
              value={newReferenceNo}
              onChange={(e) => setNewReferenceNo(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

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

export default ManageNotification;
