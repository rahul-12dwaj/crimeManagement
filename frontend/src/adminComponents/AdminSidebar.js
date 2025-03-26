import { Home, FileText, BarChart, Bell, MessageCircle, Users, Settings, AlertTriangle } from "lucide-react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="flex h-full">
      <div className="bg-gray-200 w-64 p-4 flex flex-col justify-between shadow-md">
        <div>
          <nav className="space-y-4">
            {/* Dashboard */}
            <NavLink
              to="/adminhomepage"
              end
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded hover:bg-gray-300 ${isActive ? "bg-gray-300" : ""}`
              }
            >
              <Home size={20} /> <span>Dashboard</span>
            </NavLink>
            
            {/* Manage Users */}
            <NavLink
              to="/adminhomepage/manageusers"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded hover:bg-gray-300 ${isActive ? "bg-gray-300" : ""}`
              }
            >
              <Users size={20} /> <span>Manage Users</span>
            </NavLink>

            {/* Manage Reports */}
            <NavLink
              to="/adminhomepage/managereports"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded hover:bg-gray-300 ${isActive ? "bg-gray-300" : ""}`
              }
            >
              <FileText size={20} /> <span>Manage Reports</span>
            </NavLink>

            {/* Crime Stats */}
            <NavLink
              to="/adminhomepage/managecrimestats"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded hover:bg-gray-300 ${isActive ? "bg-gray-300" : ""}`
              }
            >
              <BarChart size={20} /> <span>Manage Crime Stats</span>
            </NavLink>

            {/* Emergency Management */}
            <NavLink
              to="/admin/emergency-management"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded hover:bg-gray-300 ${isActive ? "bg-gray-300" : ""}`
              }
            >
              <AlertTriangle size={20} /> <span>Emergency Management</span>
            </NavLink>

            {/* FAQ Management */}
            <NavLink
              to="/admin/manage-faqs"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded hover:bg-gray-300 ${isActive ? "bg-gray-300" : ""}`
              }
            >
              <MessageCircle size={20} /> <span>FAQ Management</span>
            </NavLink>

            {/* Notification Management */}
            <NavLink
              to="/adminhomepage/managenotifications"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded hover:bg-gray-300 ${isActive ? "bg-gray-300" : ""}`
              }
            >
              <Bell size={20} /> <span>Manage Notifications</span>
            </NavLink>

            {/* System Settings */}
            <NavLink
              to="/admin/system-settings"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded hover:bg-gray-300 ${isActive ? "bg-gray-300" : ""}`
              }
            >
              <Settings size={20} /> <span>System Settings</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
