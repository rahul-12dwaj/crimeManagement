import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash, Search } from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionState, setActionState] = useState({ type: null, userId: null, data: null });
  const [errorMessage, setErrorMessage] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/auth/all-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error.response?.data?.message || error.message);
    }
  };

  const handleEditStart = (user) => {
    setActionState({ type: "edit", userId: user._id, data: { ...user } });
  };

  const handleDeleteStart = (userId) => {
    setActionState({ type: "delete", userId });
    setShowDialog(true);
  };

  const handleSave = async () => {
    const { userId, data } = actionState;
    if (!data.name.trim() || !data.email.trim() || !data.address.trim()) {
      setErrorMessage("All fields are required.");
      return;
    }

    const emailExists = users.some((user) => user.email === data.email && user._id !== userId);
    if (emailExists) {
      setErrorMessage("Email already exists! Please use a different email.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/api/auth/update-user/${userId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === userId ? { ...user, ...data } : user))
      );
      setActionState({ type: null, userId: null, data: null });
    } catch (error) {
      console.error("Error updating user:", error.response?.data?.message || error.message);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/auth/delete-user/${actionState.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== actionState.userId));
      setShowDialog(false);
      setActionState({ type: null, userId: null, data: null });
    } catch (error) {
      console.error("Error deleting user:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center text-blue-600">Manage Users</h1>
      
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full p-2 border rounded pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-3 text-gray-500" size={16} />
      </div>

      {errorMessage && <p className="text-red-500 mb-4 text-center">{errorMessage}</p>}

      <table className="w-full border-collapse border rounded shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Address</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((user) => (
              <tr key={user._id} className="text-center">
                <td className="p-3 border">
                  {actionState.type === "edit" && actionState.userId === user._id ? (
                    <input
                      type="text"
                      value={actionState.data.name}
                      onChange={(e) =>
                        setActionState((prev) => ({
                          ...prev,
                          data: { ...prev.data, name: e.target.value },
                        }))
                      }
                      className="border p-1 w-full"
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td className="p-3 border">{user.email}</td>
                <td className="p-3 border">{user.address}</td>
                <td className="p-3 border">
                  <div className="flex items-center justify-center gap-2">
                    {actionState.type === "edit" && actionState.userId === user._id ? (
                      <button
                        onClick={handleSave}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditStart(user)}
                          className="bg-blue-500 text-white px-3 py-1 rounded flex items-center"
                        >
                          <Pencil size={14} className="mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStart(user._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded flex items-center"
                        >
                          <Trash size={14} className="mr-1" /> Delete
                        </button>
                      </>
                    )}
                  </div>
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
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
