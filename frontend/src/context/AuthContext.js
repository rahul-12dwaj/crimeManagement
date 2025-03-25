import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve user from localStorage on initial load
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
  
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
  
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const data = await response.json();
  
        // Log the response to verify the user data structure
        console.log("Received User Data:", data);
  
        if (response.ok && data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user)); // Persist user data
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
      setLoading(false);
    };
  
    fetchUserData();
  }, []);
  

  const login = (userData, token) => {
    setUser(userData); // Update the user state
    localStorage.setItem("user", JSON.stringify(userData)); // Save user data in localStorage
    localStorage.setItem("token", token); // Save token in localStorage
  };
  

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
