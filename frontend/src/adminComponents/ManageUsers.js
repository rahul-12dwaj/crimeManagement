import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash, Search } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/auth";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editedData, setEditedData] = useState({ name: "", email: "", role: "", address: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(`${API_BASE_URL}/all-users`, { headers });
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.delete(`${API_BASE_URL}/delete-user/${userId}`, { headers });
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const startEditing = (user) => {
    setEditingUser(user._id);
    setEditedData({ name: user.name, email: user.email, role: user.role, address: user.address });
  };

  const handleEditChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.put(`${API_BASE_URL}/update-user/${editingUser}`, editedData, { headers });
      fetchUsers(); // Refresh user list after update
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
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
      <div className="overflow-x-auto h-[500] overflow-y-auto">
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
              .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(user => (
                <tr key={user._id} className="text-center">
                  <td className="p-3 border">
                    {editingUser === user._id ? (
                      <input
                        type="text"
                        name="name"
                        value={editedData.name}
                        onChange={handleEditChange}
                        className="border p-1 w-full"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="p-3 border">
                    {editingUser === user._id ? (
                      <input
                        type="text"
                        name="email"
                        value={editedData.email}
                        onChange={handleEditChange}
                        className="border p-1 w-full"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="p-3 border">
                    {editingUser === user._id ? (
                      <input
                        type="text"
                        name="address"
                        value={editedData.address}
                        onChange={handleEditChange}
                        className="border p-1 w-full"
                      />
                    ) : (
                      user.address
                    )}
                  </td>
                  <td className="p-3 border">
                    <div className="flex items-center justify-center gap-2">
                      {editingUser === user._id ? (
                        <button onClick={saveEdit} className="bg-green-500 text-white px-3 py-1 rounded">
                          Save
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(user)}
                            className="bg-blue-500 text-white px-3 py-1 rounded flex items-center"
                          >
                            <Pencil size={14} className="mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
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
      </div>
    </div>
  );
};

export default ManageUsers;
