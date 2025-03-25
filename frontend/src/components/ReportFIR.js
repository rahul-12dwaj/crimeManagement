import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegSave } from "react-icons/fa";

const ReportFIR = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", contact: "", address: "", crimeType: "",
    description: "", date: "", time: "", location: "",
    evidenceFile: null, victimName: "", witnessName: "", userId: null,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firNumber, setFirNumber] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User is not authenticated.");
      return;
    }
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch user data.");
        const data = await response.json();
        setFormData((prev) => ({ ...prev, userId: data.user._id }));
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFormData({ ...formData, evidenceFile: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Check if all required fields are filled
    if (!formData.name || !formData.contact || !formData.address || !formData.crimeType ||
        !formData.description || !formData.date || !formData.time || !formData.location ||
        !formData.victimName || !formData.witnessName || !formData.userId) {
      setError("Please fill out all fields.");
      setIsSubmitting(false);
      return;
    }

    // Convert date to YYYY-MM-DD format before sending
    const formattedDate = formData.date ? new Date(formData.date).toISOString().split("T")[0] : "";

    // Prepare the updated form data
    const updatedFormData = { ...formData, date: formattedDate };

    try {
      const response = await fetch("http://localhost:5000/api/fir/file", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(updatedFormData), // Send formatted date
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Submission failed");

      setFirNumber(result.firNumber);
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
};


  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/homepage");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-center text-blue-600">Report an FIR</h2>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Name", name: "name" },
          { label: "Contact", name: "contact" },
          { label: "Address", name: "address" },
          { label: "Location", name: "location" },
          { label: "Victim Name", name: "victimName" },
          { label: "Witness Name", name: "witnessName" }
        ].map(({ label, name }) => (
          <input
            key={name}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={label}
            required
          />
        ))}

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <select
          name="crimeType"
          value={formData.crimeType}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
          required
        >
          <option value="">Select Crime Type</option>
          {["Theft", "Robbery", "Assault", "Fraud", "Murder", "Vandalism", "Kidnapping", "Other"].map((crime, index) => (
            <option key={index} value={crime}>{crime}</option>
          ))}
        </select>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full col-span-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter crime description"
          required
        />

        <input
          type="file"
          name="evidence"
          onChange={handleFileChange}
          className="w-full p-2 border rounded-lg col-span-2"
        />

        <button
          type="submit"
          className="w-full col-span-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : <><FaRegSave className="mr-2" /> Submit FIR</>}
        </button>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
            <h3 className="text-xl font-semibold text-green-600">FIR Submitted Successfully!</h3>
            <p className="mt-2 text-gray-700">Your FIR Number is:</p>
            <p className="mt-1 text-lg font-bold text-blue-700">{firNumber}</p>
            <button
              onClick={handleCloseModal}
              className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportFIR;
