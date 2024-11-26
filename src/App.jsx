import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./components/Dashboard";
import LeaveApproval from "./components/LeaveApproval";
import TicketManagement from "./components/TicketManagement";
import EmployeeManagement from "./components/EmployeeManagement";
import EmployeeList from "./components/EmployeeList.jsx";
import AttendanceDetails from "./components/AttendanceDetails.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <Dashboard>
              <LeaveApproval />
            </Dashboard>
          }
        />
        <Route
          path="/employees"
          element={
            <Dashboard>
              <EmployeeManagement />
            </Dashboard>
          }
        />
        <Route
          path="/tickets"
          element={
            <Dashboard>
              <TicketManagement />
            </Dashboard>
          }
        />
        {/* New Route for Employee List */}
        <Route
          path="/attendance"
          element={
            <Dashboard>
              <EmployeeList />
            </Dashboard>
          }
        />
        {/* New Route for Attendance Details */}
        <Route
          path="/attendance/:email"
          element={
            <Dashboard>
              <AttendanceDetails />
            </Dashboard>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
