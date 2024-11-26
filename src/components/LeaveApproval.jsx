import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { format } from "date-fns";

const LeaveApproval = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leave data from the API
  const fetchLeaves = async () => {
    try {
      const response = await axios.get(
        "https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/api/leaves/john.doe@example.com"
      );
      setLeaves(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leave data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Handle approval/rejection actions
  const handleApproval = async (leaveId, approvedByAdmin) => {
    try {
      const response = await axios.patch(
        `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/approve/leave`,
        null,
        {
          params: { leaveId, approvedByAdmin },
        }
      );

      if (response.status === 200) {
        // Refetch the data to reflect changes in the UI
        fetchLeaves();
      }
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  };

  // Format the date
  const formatDate = (date) => format(new Date(date), "MMM dd, yyyy");
  const formatDateTime = (date) => format(new Date(date), "MMM dd, yyyy, hh:mm a");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Typography
        variant="h4"
        className="text-center font-bold text-gray-700 mb-8"
      >
        Leave Approval
      </Typography>
      {loading ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper} className="shadow-lg">
          <Table className="min-w-full">
            <TableHead>
              <TableRow className="bg-gray-800">
                <TableCell className="!text-white font-semibold">Employee Name</TableCell>
                <TableCell className="!text-white font-semibold">Employee Email</TableCell>
                <TableCell className="!text-white font-semibold">Reason</TableCell>
                <TableCell className="!text-white font-semibold">Leave Type</TableCell>
                <TableCell className="!text-white font-semibold">Days</TableCell>
                <TableCell className="!text-white font-semibold">Start Date</TableCell>
                <TableCell className="!text-white font-semibold">End Date</TableCell>
                <TableCell className="!text-white font-semibold">Status</TableCell>
                <TableCell className="!text-white font-semibold">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaves.length > 0 ? (
                leaves.map((leave) => (
                  <TableRow
                    key={leave.id}
                    className="hover:bg-gray-50 transition-all"
                  >
                    <TableCell>{leave.name}</TableCell>
                    <TableCell>{leave.email}</TableCell>
                    <TableCell>{leave.reason}</TableCell>
                    <TableCell>{leave.leaveType}</TableCell>
                    <TableCell>{leave.days}</TableCell>
                    <TableCell>{formatDate(leave.startDate)}</TableCell>
                    <TableCell>{formatDate(leave.endDate)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          leave.approvedByAdmin
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {leave.approvedByAdmin ? "Approved" : "Pending"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApproval(leave.id, true)}
                          variant="contained"
                          color="success"
                          size="small"
                          className="shadow-md"
                          disabled={leave.approvedByAdmin}
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleApproval(leave.id, false)}
                          variant="contained"
                          color="error"
                          size="small"
                          className="shadow-md"
                          disabled={leave.approvedByAdmin} // Disable reject if already approved
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography className="text-gray-500">
                      No leaves to display.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default LeaveApproval;
