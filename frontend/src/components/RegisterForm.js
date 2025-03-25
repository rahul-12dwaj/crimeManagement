import React, { useState } from "react";
import { AiOutlineMail, AiOutlineLock, AiOutlineUser, AiOutlineMobile } from "react-icons/ai";
import { MdLocationOn, MdNumbers } from "react-icons/md";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Input = ({ type, placeholder, value, onChange, icon }) => (
  <div className="relative w-full sm:w-80 mb-3">
    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 text-xl">
      {icon}
    </span>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-10 p-3 border border-cyan-400 bg-gray-900 text-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
      required
    />
  </div>
);

const RegisterForm = ({ onSwitch }) => {
  const [aadhaar, setAadhaar] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("${API_BASE_URL}/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, aadhaar, mobile, email, address, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Registration failed");

      setSuccess(data.message);
      setTimeout(() => onSwitch("login"), 1000); // Redirect to login after success
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full sm:w-96 p-6 shadow-xl rounded-lg bg-gray-900/80 backdrop-blur-md text-cyan-300 flex flex-col items-center">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">Register</h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

      <Input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} icon={<AiOutlineUser />} />
      <Input type="text" placeholder="Aadhaar Number" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} icon={<MdNumbers />} />
      <Input type="text" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} icon={<AiOutlineMobile />} />
      <Input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} icon={<AiOutlineMail />} />
      <Input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} icon={<MdLocationOn />} />
      <Input type="password" placeholder="Set Password" value={password} onChange={(e) => setPassword(e.target.value)} icon={<AiOutlineLock />} />

      <button
        className="bg-cyan-500 text-black px-4 py-2 rounded-lg w-full my-2 hover:bg-cyan-400 disabled:bg-gray-500"
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>

      <p className="text-sm mt-3">
        Already have an account?{" "}
        <button className="text-cyan-400 hover:underline" onClick={() => onSwitch("login")}>
          Login Here
        </button>
      </p>
    </div>
  );
};

export default RegisterForm;
