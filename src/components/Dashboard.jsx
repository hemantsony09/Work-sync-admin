import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate for redirection
import { Menu, MenuItem, IconButton, Typography, Avatar } from "@mui/material";
import { Logout, Menu as MenuIcon } from "@mui/icons-material";

const Dashboard = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Sidebar toggle state
  const navigate = useNavigate(); // Use to navigate to the login page after logout

  // Handle opening the menu when clicking the avatar icon
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing the menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem("userToken"); // Example: Removing user session token
    localStorage.removeItem("userDetails"); // Example: Removing any user data you stored in localStorage

    // Optionally, clear any session data or context if you're using it
    // For example, if you're using Context API:
    // dispatch(logoutAction());

    navigate("/login"); // Redirect to login page after logout
    setAnchorEl(null); // Close the menu after logging out
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`w-64 bg-gray-800 text-white p-6 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      >
        <Typography variant="h5" className="font-bold text-center text-white mb-8">
          Work Sync Admin
        </Typography>
        <nav className="flex flex-col space-y-6 border-b border-gray-600 pb-6">
          <Link to="/" className="text-white hover:text-indigo-400 transition-colors">
            Leave Approval
          </Link>
          <Link to="/employees" className="text-white hover:text-indigo-400 transition-colors">
            Employee Management
          </Link>
          <Link to="/tickets" className="text-white hover:text-indigo-400 transition-colors">
            Ticket Management
          </Link>
          <Link to="/attendance" className="text-white hover:text-indigo-400 transition-colors">Employee Attendance</Link>
        </nav>
        <div className="mt-auto flex flex-col items-start border-t border-gray-600 pt-6">
          {/* Logout button placed at the bottom */}
          <IconButton onClick={handleMenuOpen} size="large" className="text-white mb-4">
            <Avatar className="bg-indigo-500">A</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                minWidth: "150px",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <MenuItem onClick={handleLogout} className="hover:bg-indigo-500">
              <Logout fontSize="small" className="mr-2" />
              Logout
            </MenuItem>
          </Menu>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          {/* Mobile Menu Toggle */}
          <IconButton
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="md:hidden text-gray-800"
          >
            <MenuIcon />
          </IconButton>

          {/* Main Content Title */}
          <Typography variant="h4" className="font-semibold text-gray-800">
            Dashboard
          </Typography>
        </div>

        {/* Main children content */}
        <div>{children}</div>
      </main>
    </div>
  );
};

export default Dashboard;
