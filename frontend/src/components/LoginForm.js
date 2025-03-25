import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react"; 
import { AuthContext } from "../context/AuthContext"; 
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
    />
  </div>
);

const LoginForm = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const { setUser } = useContext(AuthContext); // Get setUser from context

const handleLogin = async () => {
  setLoading(true);
  setError("");
  setSuccess("");

  if (!email || !password) {
    setError("Email and Password are required");
    setLoading(false);
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) throw new Error(data.error || "Login failed");

    localStorage.setItem("token", data.token);
    setUser(data.user); // Store user in context
    setSuccess("Login successful!");
    navigate("/homepage"); // Redirect
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  

  return (
    <div className="w-full sm:w-96 p-6 shadow-xl rounded-lg bg-gray-900/80 backdrop-blur-md text-cyan-300 flex flex-col items-center">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">Login</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-2">{success}</p>}
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<AiOutlineMail />}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<AiOutlineLock />}
      />
      <button
        className="bg-cyan-500 text-black px-4 py-2 rounded-lg w-full my-2 hover:bg-cyan-400 disabled:bg-gray-500"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      <p className="text-sm mt-3">
        New here? <button className="text-cyan-400 hover:underline" onClick={() => onSwitch("register")}>Register Now</button>
      </p>
      <p className="text-sm mt-2">
        Forgot password? <button className="text-cyan-400 hover:underline" onClick={() => onSwitch("forgot")}>Reset Here</button>
      </p>
      <p className="text-sm mt-2">
        Admin Login? <button className="text-cyan-400 hover:underline" onClick={() => onSwitch("admin")}>Click Here</button>
      </p>
    </div>
  );
};

export default LoginForm;