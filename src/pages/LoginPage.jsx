import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  // Validation Schema
  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/api/users/login",
          values,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.id) {
          localStorage.setItem("user", JSON.stringify(response.data));
          alert("Login Successful!");
          navigate("/");
        } else {
          alert("Login failed. Please check your credentials.");
        }
      } catch (error) {
        if (error.response) {
          alert(
            `Login failed: ${
              error.response.data.message || "Please check your credentials."
            }`
          );
        } else {
          alert("Login failed. Please try again later.");
        }
      }
    },
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Typography variant="h4" marginBottom={3}>
        Work Sync - Login
      </Typography>
      <form onSubmit={formik.handleSubmit} style={{ width: "300px" }}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>

      <Typography
        variant="body2"
        style={{ marginTop: 20, textAlign: "center", color: "#555" }}
      >
        If you don't have an account,{" "}
        <Button
          variant="text"
          color="secondary"
          onClick={() => navigate("/register")}
        >
          Register here
        </Button>
      </Typography>
    </Box>
  );
};

export default LoginPage;
