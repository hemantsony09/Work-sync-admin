import React, { useState, useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          "https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/get-all-users"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch employee data.");
        }

        const data = await response.json();
        setEmployees(data); // Set employee data to state
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError(error.message); // Set the error message
      } finally {
        setLoading(false); // Stop loading after the fetch
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Employee List</h1>

      {loading && (
        <div className="flex justify-center items-center h-full">
          <CircularProgress />
        </div>
      )}

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <>
          <TableContainer component={Paper} className="shadow-md mb-6">
            <Table>
              <TableHead>
                <TableRow className="bg-gray-800">
                  <TableCell className="!text-white">Name</TableCell>
                  <TableCell className="!text-white">Email</TableCell>
                  <TableCell className="!text-white">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.length > 0 ? (
                  employees.map((employee) => (
                    <TableRow key={employee.id} className="hover:bg-gray-100">
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => navigate(`/attendance/${employee.email}`)}
                        >
                          View Attendance
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No employees found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default EmployeeList;
