import { useState, useEffect } from "react";

const CurrentFIRs = () => {
  const [firData, setFirData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingFIR, setEditingFIR] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteFIR, setDeleteFIR] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchFIRData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/fir/previous`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch FIR data");
        }

        const data = await response.json();
        setFirData(data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching FIR data. Please try again.");
        setLoading(false);
      }
    };

    fetchFIRData();
  }, []);

  const handleDeleteConfirm = (fir) => {
    if (fir.status === "Resolved") {
      setShowWarning(true);
      return;
    }
    setDeleteFIR(fir.firNumber);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (!deleteFIR) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/fir/delete/${deleteFIR}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete FIR");

      setFirData(firData.filter((fir) => fir.firNumber !== deleteFIR));
      setShowConfirm(false);
      setDeleteFIR(null);
    } catch (error) {
      setError("Error deleting FIR. Please try again.");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-lg font-bold mb-2 text-blue-600">Previous FIRs & Reports:</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : firData.length === 0 ? (
        <p>No previous FIRs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 h-[550px] overflow-y-auto">
          {firData.map((fir) => (
            <div key={fir.firNumber} className="p-4 border rounded-lg shadow-md bg-gray-100">
              <p className="font-semibold text-blue-600">FIR Number: {fir.firNumber}</p>
              <p><strong>Date:</strong> {fir.date}</p>
              <p><strong>Time:</strong> {fir.time}</p>
              <p><strong>Location:</strong> {fir.location}</p>
              <p><strong>Crime Type:</strong> {fir.crimeType}</p>
              <p><strong>Description:</strong> {fir.description}</p>
              <p><strong>Status:</strong> {fir.status}</p>
              <button onClick={() => handleDeleteConfirm(fir)} className="mt-2 px-4 py-1 bg-red-500 text-white rounded">Delete</button>
            </div>
          ))}
        </div>
      )}

      {showConfirm && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">Are you sure you want to delete this FIR?</p>
            <button onClick={handleDelete} className="px-4 py-1 bg-red-500 text-white rounded mr-2">Yes</button>
            <button onClick={() => setShowConfirm(false)} className="px-4 py-1 bg-gray-500 text-white rounded">No</button>
          </div>
        </div>
      )}

      {showWarning && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">You cannot delete FIRs of resolved cases for security reasons. Your case may play a key role in solving future cases.</p>
            <button onClick={() => setShowWarning(false)} className="px-4 py-1 text-white rounded bg-blue-600">OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentFIRs;
