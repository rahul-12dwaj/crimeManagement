import React, { useEffect, useState } from "react";
import { AlertCircle, FileText, Bell } from "lucide-react";

const AdminDashboard = () => {
  const [firs, setFirs] = useState([]);
  const [crimeList, setCrimeList] = useState([]);

  // Function to fetch all FIRs
  const fetchFirs = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/fir/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Fetched FIRs:", data); // ✅ Debugging

      if (!Array.isArray(data)) {
        throw new Error("Response is not an array.");
      }

      setFirs(data);

      // Extract unique crime types from FIRs
      const extractedCrimes = [
        ...new Set(data.map((fir) => fir.crimeType)),
      ]; // Removes duplicates
      setCrimeList(extractedCrimes);

    } catch (error) {
      console.error("Error fetching FIRs:", error);
    }
  };

  // Fetch FIRs when component mounts
  useEffect(() => {
    fetchFirs();
  }, []);

  const alerts = [
    { id: 1, message: "New FIR needs review", priority: "High" },
    { id: 2, message: "Crime rate increasing in Sector 12", priority: "Medium" },
  ];

  return (
    <div className="bg-gray-100 h-auto">
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FIRs Posted Section */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-2xl font-semibold text-blue-600 flex items-center">
            <FileText className="mr-2" /> FIRs Posted
          </h2>
          <ul className="mt-4 space-y-3 h-[200px] overflow-y-auto">
            {firs.map((fir) => (
              <li key={fir.firNumber} className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100">
                <strong>{fir.firNumber}</strong> {/* FIR Number as Title */}
                <p className="text-sm text-gray-600">Crime Type: {fir.crimeType}</p>
                <p className="text-sm text-gray-600">Location: {fir.location}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Crime List Section */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-2xl font-semibold text-red-600 flex items-center">
            <AlertCircle className="mr-2" /> Crime List
          </h2>
          <ul className="mt-4 space-y-3 h-[200px] overflow-y-auto">
            {crimeList.map((crime, index) => (
              <li key={index} className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100">
                <strong>{crime}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Admin Alerts Section */}
      <div className="bg-white shadow-md rounded-lg p-4 mt-6">
        <h2 className="text-2xl font-semibold text-yellow-600 flex items-center">
          <Bell className="mr-2" /> Admin Alerts
        </h2>
        <ul className="mt-4 space-y-3">
          {alerts.map((alert) => (
            <li key={alert.id} className="p-3 border rounded-lg bg-yellow-50 hover:bg-yellow-100">
              <strong>{alert.message}</strong>
              <p className="text-sm text-gray-600">Priority: {alert.priority}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
