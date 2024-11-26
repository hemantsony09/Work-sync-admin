import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {TextField,Button,Box,Typography,CircularProgress,} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await axios.patch(
          "https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/api/users/register",
          {
            email: values.email,
            password: values.password,
            role: "employee",
            approvedByAdmin: false,
            joiningDate: new Date().toISOString().split("T")[0],
          }
        );
        alert("Registration Successful!");
        navigate("/login");
      } catch (error) {
        alert(
          error.response?.data?.message ||
          "Registration failed. Please try again."
        );
      } finally {
        setIsSubmitting(false);
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
      bgcolor="#f5f5f5"
    >
      <Typography variant="h4" marginBottom={3}>
        Work Sync - Register
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isSubmitting}
          startIcon={isSubmitting && <CircularProgress size={20} />}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </form>
      <Typography
        variant="body2"
        style={{ marginTop: "20px", textAlign: "center", color: "#555" }}
      >
        If you already have an account,{" "}
        <Button
          variant="text"
          color="secondary"
          onClick={() => navigate("/login")}
        >
          Log in here
        </Button>
      </Typography>
    </Box>
  );
};

export default RegisterPage;
