import React, { useEffect, useState } from "react";
import { FileText, Archive, Edit } from "lucide-react";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ManageReports = () => {
  const [firs, setFirs] = useState([]);
  const [archivedFirs, setArchivedFirs] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [selectedStatus, setSelectedStatus] = useState({}); // Track selected status

  useEffect(() => {
    const fetchFirs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. Redirecting to login...");
          return;
        }
  
        // Fetch all FIRs
        const response = await fetch(`${API_BASE_URL}/api/fir/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch FIRs");
        }
  
        const data = await response.json();
        console.log("Fetched FIRs:", data);
        setFirs(data);
  
        // Fetch Resolved FIRs (Archived)
        const resolvedResponse = await fetch(`${API_BASE_URL}/api/fir/resolved`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!resolvedResponse.ok) {
          throw new Error("Failed to fetch resolved FIRs");
        }
  
        const resolvedData = await resolvedResponse.json();
        console.log("Fetched Resolved FIRs:", resolvedData);
        setArchivedFirs(resolvedData);
  
        // Set Initial Statuses
        const initialStatuses = {};
        const initialSelectedStatus = {};
        data.forEach((fir) => {
          initialStatuses[fir.firNumber] = fir.status || "Pending";
          initialSelectedStatus[fir.firNumber] = fir.status || "Pending";
        });
        setStatuses(initialStatuses);
        setSelectedStatus(initialSelectedStatus);
      } catch (error) {
        console.error("Error fetching FIRs:", error);
      }
    };
  
    fetchFirs();
  }, []);
  

  const updateStatus = async (firNumber) => {
    try {
      const newStatus = selectedStatus[firNumber];
  
      // Show confirmation dialog
      const isConfirmed = window.confirm(`Are you sure you want to update FIR ${firNumber} to "${newStatus}"?`);
      if (!isConfirmed) return; // Exit function if user cancels
  
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found.");
        return;
      }
  
      const response = await fetch(`${API_BASE_URL}/api/fir/updateStatus/${firNumber}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
  
      setStatuses((prev) => ({
        ...prev,
        [firNumber]: newStatus,
      }));
  
      alert(`Status updated for FIR ${firNumber} to ${newStatus}`); // Success alert
    } catch (error) {
      console.error("Error updating FIR status:", error);
    }
  };
  

  const archiveFIR = (firNumber) => {
    const firToArchive = firs.find((fir) => fir.firNumber === firNumber);
    if (firToArchive) {
      setArchivedFirs((prev) => [...prev, firToArchive]);
      setFirs(firs.filter((fir) => fir.firNumber !== firNumber));
      alert(`FIR ${firNumber} has been archived successfully!`); // Alert Box
    }
  };

  return (
    <div className="bg-gray-100 h-auto m-4">
      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FIRs List Section */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-2xl font-semibold text-blue-600 flex items-center">
            <FileText className="mr-2" /> FIR Reports
          </h2>
          <ul className="mt-4 space-y-3 h-[500px] overflow-y-auto scroll-smooth snap-y snap-mandatory">
            {firs.length > 0 ? (
              firs.map((fir) => (
                <li key={fir.firNumber} className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 snap-start h-[500px] flex flex-col justify-between">
                  <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">FIR Number: {fir.firNumber}</h2>
                    <p className="text-sm text-gray-600"><strong>Crime Type:</strong> {fir.crimeType}</p>
                    <p className="text-sm text-gray-600"><strong>Date:</strong> {new Date(fir.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600"><strong>Time:</strong> {fir.time}</p>
                    <p className="text-sm text-gray-600"><strong>Location:</strong> {fir.location}</p>
                    <p className="text-sm text-gray-600"><strong>Description:</strong> {fir.description}</p>
                    <p className="text-sm text-gray-600"><strong>Estimated Resolution Time:</strong> {fir.estimatedTime}</p>
                    <p className="text-sm text-gray-600"><strong>Status:</strong> {statuses[fir.firNumber]}</p>

                    {/* User Details */}
                    <h3 className="mt-2 text-md font-medium text-gray-800">Filed By:</h3>
                    <p className="text-sm text-gray-600"><strong>Name:</strong> {fir.user?.name || "N/A"}</p>
                    <p className="text-sm text-gray-600"><strong>Aadhaar:</strong> {fir.user?.aadhaar || "N/A"}</p>
                    <p className="text-sm text-gray-600"><strong>Email:</strong> {fir.user?.email || "N/A"}</p>
                    <p className="text-sm text-gray-600"><strong>Contact:</strong> {fir.user?.mobile || "N/A"}</p>
                    <p className="text-sm text-gray-600"><strong>Address:</strong> {fir.user?.address || "N/A"}</p>

                    <p className="text-xs text-gray-500 mt-2">Created At: {new Date(fir.createdAt).toLocaleString()}</p>
                  </div>

                  {/* Status Dropdown */}
                  <div className="mt-2 flex items-center space-x-2">
                    <label className="text-gray-600">Status:</label>
                    <select
                      className="border rounded p-1"
                      value={selectedStatus[fir.firNumber]}
                      onChange={(e) =>
                        setSelectedStatus((prev) => ({
                          ...prev,
                          [fir.firNumber]: e.target.value,
                        }))
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3 flex space-x-3">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center"
                      onClick={() => updateStatus(fir.firNumber)}
                    >
                      <Edit className="mr-1" size={16} /> Update
                    </button>
                    <button
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-700 flex items-center"
                      onClick={() => archiveFIR(fir.firNumber)}
                    >
                      <Archive className="mr-1" size={16} /> Archive
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-600">No FIR reports available.</p>
            )}
          </ul>
        </div>

        {/* Archived FIRs Section */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-2xl font-semibold text-red-600 flex items-center">
            <Archive className="mr-2" /> Archived FIRs
          </h2>
          <ul className="mt-4 space-y-3">
            {archivedFirs.length > 0 ? (
              archivedFirs.map((fir) => (
                <li key={fir.firNumber} className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 snap-start h-[150px] flex flex-col justify-between">
                  <strong>FIR Number:</strong> {fir.firNumber}
                  <p className="text-sm text-gray-600"><strong>Crime Type:</strong> {fir.crimeType}</p>
                  <p className="text-sm text-gray-600"><strong>Filed By:</strong> {fir.user?.name || "N/A"}</p>
                  <p className="text-sm text-gray-600"><strong>Status:</strong> {statuses[fir.firNumber]}</p>
                </li>
              ))
            ) : (
              <p className="text-gray-600">No archived FIRs.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageReports;
