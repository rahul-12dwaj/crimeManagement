import { Home, FileText, BarChart, Bell, MessageCircle,  AlertTriangle } from "lucide-react";
import { NavLink} from "react-router-dom";

const SideBar = () => {
  return (
    <div className="flex  h-full">
      <div className="bg-gray-200 w-64 p-4 flex flex-col justify-between shadow-md">
        <div>
          <nav className="space-y-4">
            <NavLink to="/homepage" end className={({ isActive }) => `flex items-center space-x-2 p-2 rounded hover:bg-gray-300 ${isActive ? "bg-gray-300" : ""}`}>
              <Home size={20} /> <span>Dashboard</span>
            </NavLink>
            <NavLink to="/homepage/report-fir" className={({ isActive }) => `flex items-center space-x-2 p-2 rounded hover:bg-gray-300 ${isActive ? "bg-gray-300" : ""}`}>
              <FileText size={20} /> <span>Report FIR</span>
            </NavLink>
            <NavLink to="/homepage/crime-stats" className={({ isActive }) => `flex items-center space-x-2 p-2 rounded hover:bg-gray-300 ${isActive ? "bg-gray-300" : ""}`}>
              <BarChart size={20} /> <span>Crime Stats</span>
            </NavLink>
            <NavLink to="/homepage/emergency" className={({ isActive }) => `flex items-center space-x-2 p-2 rounded hover:bg-gray-300 ${isActive ? "bg-gray-300" : ""}`}>
              <AlertTriangle size={20} /> <span>Emergency</span>
            </NavLink>
            <NavLink to="/homepage/faqs" className={({ isActive }) => `flex items-center space-x-2 p-2 rounded hover:bg-gray-300 ${isActive ? "bg-gray-300" : ""}`}>
              <MessageCircle size={20} /> <span>FAQs</span>
            </NavLink>
            <NavLink to="/homepage/notifications" className={({ isActive }) => `flex items-center space-x-2 p-2 rounded hover:bg-gray-300 ${isActive ? "bg-gray-300" : ""}`}>
              <Bell size={20} /> <span>Notification</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
