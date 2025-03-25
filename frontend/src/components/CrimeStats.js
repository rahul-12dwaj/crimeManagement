import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CrimeStats = () => {
  const [crimeData, setCrimeData] = useState([]);

  useEffect(() => {
    fetchCrimeStats();
  }, []);

  const fetchCrimeStats = async () => {
    try {
      const response = await fetch("${API_BASE_URL}/api/crimes/all-crimes"); // Adjust API URL if needed
      const data = await response.json();
      
      // Transform data for Recharts
      const formattedData = data.map((crime) => ({
        name: crime.name,
        count: crime.count
      }));

      setCrimeData(formattedData);
    } catch (error) {
      console.error("Error fetching crime stats:", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg w-auto m-4">
      <h2 className="text-3xl font-bold mb-4 text-center text-blue-600">Crime Statistics</h2>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={crimeData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CrimeStats;
