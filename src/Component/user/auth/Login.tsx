import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Alert } from '@mui/material';
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from 'axios';
import { axiosUserInstance } from '../../../utils/axios/Axios';
import { useDispatch } from 'react-redux';
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { userLogin } from '../../../Redux/Slice/userSlice';
import { adminLogin } from '../../../Redux/Slice/adminSlice';
import { jwtDecode,JwtPayload } from 'jwt-decode';

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const clientId = '583058367283-v8k2j9i94eimjrr00e14df631d089j42.apps.googleusercontent.com';
  const [errorMessage, setErrorMessage] = useState('');
  const handleJoin = () => {
    navigate('/register');
  }
  
  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    const { credential } = credentialResponse;
  
    try {
      const response = await axiosUserInstance.post("/google-login", {
        credential,
      });
  
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("userToken", token);
        const decodedToken = jwtDecode<{ email: string ,userId:string} & JwtPayload>(token);
        const email = decodedToken.email;
        const _id = decodedToken.userId;
        if (!email) {
          console.error("Email not found in token.");
          setErrorMessage("Failed to extract email from the token.");
          return;
        }
  
        dispatch(userLogin({ userEmail: email,_id }));
  
        navigate("/home");
      } else {
        setErrorMessage("Failed to store user data in the database.");
      }
    } catch (error) {
      console.error("Error while processing Google login:", error);
    }
  };
  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axiosUserInstance.post('/login_submit', values);
  
        if (response.status === 200) {
          const { isAdmin, token, _id, isActive } = response.data;
          console.log("RESDA", response.data);
          
          if (!isActive) {
            setErrorMessage('User Blocked');
            return;
          }
  
          if (isAdmin) {
            localStorage.setItem('adminToken', token);
            dispatch(adminLogin({ adminEmail: values.email, token }));
            navigate('/admin/dashboard', { state: values });
          } else {
            localStorage.setItem('userToken', token);
            dispatch(userLogin({ userEmail: values.email, token, _id ,isActive }));
            navigate('/home', { state: values });
          }
        } else if (response.status === 400) {
          setErrorMessage(response.data.message);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error during login:', error);
          if (error.response?.status === 403) {
            setErrorMessage('User Blocked');
          } else {
            setErrorMessage(error.response?.data?.message || 'An error occurred during login. Please try again.');
          }
        } else {
          setErrorMessage('An unexpected error occurred. Please try again.');
        }
      }
    },
  });
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <Box
        sx={{ backgroundColor: 'white', boxShadow: 8, borderRadius: 4, p: 8, width: 'full', maxWidth: '800px' }}
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
           Sign In
          </Typography>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <form className="mt-4" onSubmit={formik.handleSubmit}>
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="w-80 md:w-88 mb-4"
              style={{ borderRadius: '20px' }}
            >
              Sign In man
            </Button>
            <Link to='/recruiter/reclogin' className="mt-4 md:ml-10 inline-block text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out">
              Sign in as a recruiter
            </Link>
            <div className="flex items-center justify-center my-4 mx-auto md:mr-16 md:ml-auto ">
              <div className="w-28 border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">or</span>
              <div className="w-28 border-t border-gray-300"></div>
            </div>
            <GoogleOAuthProvider clientId={clientId}>
              <div style={{ maxWidth: '320px', border: '1px solid black', borderRadius: "5px" }}>
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={() => {
                    console.log('Login Failed');
                  }}
                />
              </div>
            </GoogleOAuthProvider>

            <Button
              className="w-80 md:w-88 mb-4"
              sx={{
                backgroundColor: 'white',
                color: 'black',
                borderRadius: '5px',
                border: '1px solid black',
                textTransform: 'none',
                marginTop: '10px'
              }}
              onClick={handleJoin}
            >
              New to careercraze? Join now
            </Button>
          </form>
        </div>
        <img
          src='../../../Images/front.jpg'
          alt="Front"
          className="order-1 md:order-2 w-48 md:w-64 h-auto rounded-xl mt-4 md:mt-0"
          style={{ boxShadow: '-3px 10px 30px rgba(0, 0, 0, 0.5)' }}
        />
      </Box>
    </div>
  );
}

export default Login;
