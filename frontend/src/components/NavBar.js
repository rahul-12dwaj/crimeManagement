import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="w-full fixed top-0 left-0 bg-gray-900 text-white flex justify-between items-center px-6 py-4 shadow-md">
      {/* Left Side - Logo & User Info */}
      <div className="flex items-center space-x-4">
        <div className="bg-white text-black rounded-full p-2">
          <span className="text-lg font-semibold">👤</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-cyan-300">Crime Management</h1>
          {user ? (
            <p className="text-sm text-gray-300">
              {user.name} | {user.address} | {user.contact}
            </p>
          ) : (
            <p className="text-sm text-gray-400">Guest</p>
          )}
        </div>
      </div>

      {/* Right Side - Menu */}
      <div className="flex items-center space-x-6">
        {user ? (
          <button
            onClick={logout}
            className="bg-red-500 px-3 py-1 rounded-md text-white text-sm hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <a href="/login" className="text-cyan-300 hover:text-cyan-400 text-sm">
            Login
          </a>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
