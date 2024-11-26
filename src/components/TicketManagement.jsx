import React, { useEffect, useState } from "react";
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
  Chip,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { format } from "date-fns";

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingTicketId, setUpdatingTicketId] = useState(null);

  const email = "ishan@gmail.com"; // Replace with dynamic email if required.

  // Fetch all tickets
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/api/tickets/${email}`
      );
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Update ticket status
  const updateStatus = async (ticketId, newStatus) => {
    setUpdatingTicketId(ticketId);
    try {
      const response = await axios.patch(
        `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/api/tickets/status`,
        null,
        {
          params: { ticketId, status: newStatus },
        }
      );

      if (response.status === 200) {
        // Update the ticket's status locally
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
          )
        );
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
    } finally {
      setUpdatingTicketId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-700";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-700";
      case "CLOSED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <Typography
        variant="h4"
        className="text-center font-bold text-gray-800 mb-8"
      >
        Ticket Management System
      </Typography>
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <CircularProgress size={60} />
        </div>
      ) : (
        <TableContainer
          component={Paper}
          className="shadow-xl rounded-lg overflow-hidden"
        >
          <Table>
            <TableHead>
              <TableRow className="bg-gray-800">
                <TableCell className="!text-white font-semibold text-center">
                  Ticket ID
                </TableCell>
                <TableCell className="!text-white font-semibold text-center">
                  Email
                </TableCell>
                <TableCell className="!text-white font-semibold text-center">
                  Title
                </TableCell>
                <TableCell className="!text-white font-semibold text-center">
                  Description
                </TableCell>
                <TableCell className="!text-white font-semibold text-center">
                  Status
                </TableCell>
                <TableCell className="!text-white font-semibold text-center">
                  Created At
                </TableCell>
                <TableCell className="!text-white font-semibold text-center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className="hover:bg-gray-100 transition-all"
                >
                  <TableCell className="text-center">{ticket.id}</TableCell>
                  <TableCell className="text-center">{ticket.email}</TableCell>
                  <TableCell className="text-center">{ticket.title}</TableCell>
                  <TableCell className="text-center">
                    <Tooltip title={ticket.description}>
                      <span>{ticket.description.slice(0, 20)}...</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-center">
                    <Chip
                      label={ticket.status}
                      className={`capitalize px-4 py-2 ${getStatusColor(
                        ticket.status
                      )}`}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    {format(new Date(ticket.createdAt), "MMM dd, yyyy, hh:mm a")}
                  </TableCell>
                  <TableCell className="text-center">
                    {ticket.status !== "CLOSED" && (
                      <div className="flex justify-center gap-4">
                        <Button
                          onClick={() => updateStatus(ticket.id, "IN_PROGRESS")}
                          variant="contained"
                          color="primary"
                          size="small"
                          disabled={updatingTicketId === ticket.id}
                        >
                          {updatingTicketId === ticket.id &&
                          ticket.status === "IN_PROGRESS"
                            ? "Updating..."
                            : "In Progress"}
                        </Button>
                        <Button
                          onClick={() => updateStatus(ticket.id, "CLOSED")}
                          variant="contained"
                          color="success"
                          size="small"
                          disabled={updatingTicketId === ticket.id}
                        >
                          {updatingTicketId === ticket.id &&
                          ticket.status === "CLOSED"
                            ? "Updating..."
                            : "Close"}
                        </Button>
                      </div>
                    )}
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

export default TicketManagement;
