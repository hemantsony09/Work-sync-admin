import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Alert } from "@mui/material";
import { format } from "date-fns"; // Importing date-fns for date formatting

const AttendanceDetails = () => {
  const { email } = useParams(); // Extract email from route parameters
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // To store any errors

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // Fetch attendance based on email
        const response = await fetch(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/api/attendance/${email}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch attendance data.");
        }

        const data = await response.json();

        if (data && Array.isArray(data)) {
          setAttendance(data); // Set fetched attendance data
        } else {
          throw new Error("No data found for this email.");
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
        setError(error.message); // Set the error message if there's an issue
      } finally {
        setLoading(false); // Stop loading after the fetch is done
      }
    };

    fetchAttendance();
  }, [email]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Attendance Details</h1>

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
                  <TableCell className="!text-white">Date</TableCell>
                  <TableCell className="!text-white">Punch In</TableCell>
                  <TableCell className="!text-white">Punch Out</TableCell>
                  <TableCell className="!text-white">Total Hours</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendance.length > 0 ? (
                  attendance.map((record) => {
                    // Formatting the date and times to 12-hour AM/PM format
                    const formattedDate = format(new Date(record.date), "MMM dd, yyyy");
                    const punchInTime = format(new Date(record.punchInTime), "hh:mm a");
                    const punchOutTime = format(new Date(record.punchOutTime), "hh:mm a");

                    return (
                      <TableRow key={record.id} className="hover:bg-gray-100">
                        <TableCell>{formattedDate}</TableCell>
                        <TableCell>{punchInTime}</TableCell>
                        <TableCell>{punchOutTime}</TableCell>
                        <TableCell>{record.totalWorkingHours} hrs</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No attendance records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="flex justify-center">
            <Button variant="outlined" color="secondary" onClick={() => navigate("/attendance")}>
              Back to Employee List
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AttendanceDetails;
