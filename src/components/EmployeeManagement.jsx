import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Tooltip,
} from "@mui/material";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch employees data
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/get-all-users"
        );
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Handle approval or rejection
  const handleApproval = async (email, approvedByAdmin) => {
    setUpdating(true);
    try {
      const newStatus = !approvedByAdmin;
      const response = await axios.patch(
        `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/approve/access?email=${email}&approvedByAdmin=${newStatus}`
      );

      if (response.status === 200) {
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.email === email ? { ...emp, approvedByAdmin: newStatus } : emp
          )
        );
      }
    } catch (error) {
      console.error("Error approving/rejecting employee:", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <Typography
        variant="h4"
        className="text-center font-bold text-gray-800 mb-8"
      >
        Employee Management
      </Typography>
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <CircularProgress size={60} />
        </div>
      ) : (
        <TableContainer
          component={Paper}
          className="shadow-lg rounded-lg overflow-hidden"
        >
          <Table>
            <TableHead>
              <TableRow className="bg-gray-800">
                <TableCell className="!text-white font-semibold text-center">
                  Employee Name
                </TableCell>
                <TableCell className="!text-white font-semibold text-center">
                  Email
                </TableCell>
                <TableCell className="!text-white font-semibold text-center">
                  Status
                </TableCell>
                <TableCell className="!text-white font-semibold text-center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((emp) => (
                <TableRow
                  key={emp.email}
                  className="hover:bg-gray-100 transition-all"
                >
                  <TableCell className="text-center">{emp.name}</TableCell>
                  <TableCell className="text-center">{emp.email}</TableCell>
                  <TableCell className="text-center">
                    <Chip
                      label={emp.approvedByAdmin ? "Approved" : "Not Approved"}
                      className={`capitalize px-4 py-2 ${
                        emp.approvedByAdmin
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Tooltip
                      title={
                        emp.approvedByAdmin
                          ? "Revoke approval for this employee"
                          : "Approve this employee"
                      }
                    >
                      <Button
                        variant="contained"
                        color={emp.approvedByAdmin ? "error" : "success"}
                        size="small"
                        onClick={() =>
                          handleApproval(emp.email, emp.approvedByAdmin)
                        }
                        disabled={updating}
                      >
                        {emp.approvedByAdmin ? "Reject" : "Approve"}
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default EmployeeManagement;
