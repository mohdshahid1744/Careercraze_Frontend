import React,{useState} from 'react';
import { Button, TextField, Typography, Box ,Snackbar,Alert} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from "formik";
import * as yup from "yup";
import { axiosInstance } from '../../../utils/axios/Axios';

const validationSchema = yup.object({
   name: yup
  .string()
  .required("Name is required")
  .test("no-spaces", "Name should not contain only spaces", (value) => {
    return value ? !(/^\s+$/.test(value)) : false;
  }),
  email: yup
  .string()
  .email("Invalid email address")
  .required("Email is required"),
  mobile: yup
  .string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
    password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required")
});


function Signup() {
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState('');
  
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axiosInstance.post('/signup_submit', values);
        if (response.status === 201) {
          navigate('/otp', { state: values });
        } else if (response.status === 400) {
          setSignupError(response.data.message);
        } else {
          console.error('Signup failed:', response.data.message);
        }
      } catch (error) {
        console.error('Error during signup:', error);
      }
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <Box
        sx={{ backgroundColor: 'white', boxShadow: 8, borderRadius: 4, p: 8, width: 'full', maxWidth: '800px',maxHeight:'900px' }}
        className="flex flex-col md:flex-row items-center relative"
      >
        <img
          src='../../../Images/logo.png'
          alt="Logo"
          className="w-16 h-auto absolute"
          style={{ top: '20px', left: '20px' }}
        />

        <div className="order-2 md:order-1 flex flex-col justify-center md:ml-4">
          <Typography component="h1" variant="h5" className="text-2xl font-bold text-center">
            Sign Up
          </Typography>

          <form className="mt-4" onSubmit={formik.handleSubmit}>
            <TextField
              variant="outlined"
              required
              id="name"
              label="Name"
              name="name"
              size="small"
              className="w-80 md:w-88 mb-4"
              autoComplete="name"
              InputProps={{
                style: { borderRadius: '10px' }
              }}
              sx={{ marginBottom: '16px' }}
              autoFocus
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              variant="outlined"
              required
              id="email"
              label="Email Address"
              name="email"
              size="small"
              className="w-80 md:w-88 mb-4"
              autoComplete="email"
              InputProps={{
                style: { borderRadius: '10px' }
              }}
              sx={{ marginBottom: '16px' }}
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              variant="outlined"
              required
              id="mobile"
              label="Mobile"
              name="mobile"
              size="small"
              className="w-80 md:w-88 mb-4"
              autoComplete="mobile"
              InputProps={{
                style: { borderRadius: '10px' }
              }}
              sx={{ marginBottom: '16px' }}
              autoFocus
              value={formik.values.mobile}
              onChange={formik.handleChange}
              error={formik.touched.mobile && Boolean(formik.errors.mobile)}
              helperText={formik.touched.mobile && formik.errors.mobile}
            />
            <TextField
              variant="outlined"
              required
              name="password"
              label="Password"
              type="password"
              size="small"
              id="password"
              autoComplete="current-password"
              className="w-80 md:w-88 mb-4"
              InputProps={{
                style: { borderRadius: '10px' }
              }}
              sx={{ marginBottom: '16px' }}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <TextField
              variant="outlined"
              required
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              size="small"
              id="confirmPassword"
              autoComplete="confirm-password"
              className="w-80 md:w-88 mb-4"
              InputProps={{
                style: { borderRadius: '10px' }
              }}
              sx={{ marginBottom: '16px' }}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />
            
{signupError && (
  <Snackbar open={!!signupError} autoHideDuration={6000} onClose={() => setSignupError('')}>
    <Alert severity="error" onClose={() => setSignupError('')}>{signupError}</Alert>
  </Snackbar>
)}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="w-80 md:w-88 mb-4"
              style={{ borderRadius: '20px' }}
            >
              Join now
            </Button>
            <div className="flex items-center justify-center my-4 mx-auto md:mr-16 md:ml-auto ">
              <div className="w-28 border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">or</span>
              <div className="w-28 border-t border-gray-300"></div>
            </div>
    
            <Link to="/" className="mt-4 md:ml-8">
              Already have an account? <span className="underline">Login</span>
            </Link>
          </form>
        </div>
        <img
          src='../../../Images/signup.jpg'
          alt="Front"
          className="order-1 md:order-2 w-40 md:w-64 h-auto rounded-xl mt-4 md:mt-0"
          style={{ boxShadow: '-3px 10px 30px rgba(0, 0, 0, 0.5)' }}
        />
      </Box>
    </div>
  );
}

export default Signup;
