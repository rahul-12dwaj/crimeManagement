import React, { useEffect, useState } from "react";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const predefinedCrimeTypes = [
  "Select Crime Type",
  "Theft",
  "Robbery",
  "Assault",
  "Burglary",
  "Fraud",
  "Murder",
  "Sexual Assault",
  "Vandalism",
  "Kidnapping",
  "Domestic Violence",
  "Drunk Driving",
  "Other",
];

const ManageCrimeStats = () => {
  const [crimeStats, setCrimeStats] = useState([]);
  const [crimeTypes, setCrimeTypes] = useState(predefinedCrimeTypes);
  const [selectedCrime, setSelectedCrime] = useState("");
  const [updateCount, setUpdateCount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCrimeStats();
  }, []);

  const fetchCrimeStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/crimes/all-crimes`);
      const data = await response.json();

      const fetchedCrimeTypes = data.map((crime) => crime.name);
      const mergedCrimeTypes = [...new Set([...predefinedCrimeTypes, ...fetchedCrimeTypes])];

      setCrimeTypes(mergedCrimeTypes);
      setCrimeStats(data);
      if (mergedCrimeTypes.length > 0) setSelectedCrime(mergedCrimeTypes[0]);
    } catch (error) {
      console.error("Error fetching crime stats:", error);
    }
  };

  const updateCrimeCount = async () => {
    if (!selectedCrime || isNaN(updateCount) || updateCount === "") {
      alert("Please select a crime and enter a valid count.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/crimes/${selectedCrime}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: parseInt(updateCount) }),
      });

      const data = await response.json();
      alert(data.message);
      fetchCrimeStats();
      setUpdateCount("");
    } catch (error) {
      console.error("Error updating crime count:", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Manage Crime Stats</h2>

      {/* ✅ Row Layout: Update Form & Stats Table Side by Side */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ✅ Update Crime Count Section */}
        <div className="bg-white p-4 rounded-lg shadow-md w-full lg:w-1/2">
          <h3 className="text-lg font-semibold mb-2">Update Crime Count</h3>
          <label className="block mb-1 font-medium">Select Crime:</label>
          <select
            value={selectedCrime}
            onChange={(e) => setSelectedCrime(e.target.value)}
            className="w-full p-2 border rounded-md mb-3"
          >
            {crimeTypes.map((crime) => (
              <option key={crime} value={crime}>
                {crime}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="New Count"
            value={updateCount}
            onChange={(e) => setUpdateCount(e.target.value)}
            className="w-full p-2 border rounded-md mb-3"
          />
          <button
            onClick={updateCrimeCount}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
          >
            Update
          </button>
        </div>

        {/* ✅ Crime Statistics Section */}
        <div className="bg-white p-4 rounded-lg shadow-md w-full lg:w-1/2">
          <h3 className="text-lg font-semibold mb-2">Crime Statistics</h3>
          <ul className="bg-white p-4 rounded-lg shadow-md  h-[450px] overflow-y-auto">
            {crimeStats.map((crime) => (
                <li key={crime.name} className="flex justify-between border-b p-2">
                <span className="font-medium">{crime.name}</span>
                <span className="text-gray-700">{crime.count}</span>
                </li>
            ))}
            </ul>

        </div>
      </div>
    </div>
  );
};

export default ManageCrimeStats;
