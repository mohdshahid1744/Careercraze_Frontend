import React,{useState} from 'react';
import { Button, TextField, Typography, Box ,Alert} from '@mui/material';
import { useNavigate,Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from 'axios';
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { axiosRecruiterInstance } from '../../../utils/axios/Axios';
import { useDispatch } from 'react-redux';
import { recruiterLogin } from '../../../Redux/Slice/recruiterSlice';

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

function RecLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const clientId='583058367283-v8k2j9i94eimjrr00e14df631d089j42.apps.googleusercontent.com'
  const [errorMessage, setErrorMessage] = useState('');
  const handleGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    const { credential } = credentialResponse;
  
    try {
      const response = await axiosRecruiterInstance.post("/recruiter/google-login", {
        credential,
      });
  console.log("SFDD",response);
  
      if (response.status === 200) {
        const token = response.data.token;
  
        localStorage.setItem("recruiterToken", token);
        dispatch(recruiterLogin({ userEmail: response.data.email, token })); 
  
        navigate("/recruiter/recHome");
        console.error("Failed to store user data in the database.");
      }
    } catch (error) {
      console.error("Error while processing Google login:", error);
    }
  };
    const handleJoin=()=>{
      navigate('/recruiter/recsignup')
    }
    const formik = useFormik({
      initialValues: {
        email: '',
        password: ''
      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        try {
          const response = await axiosRecruiterInstance.post('/recruiter/recLogin', values);
          console.log("dsa",response);
          
          if (response.status === 200) {
           
            
            
            const { _id, userEmail, token } = response.data;
              localStorage.setItem('recruiterToken', token);
        dispatch(recruiterLogin({ _id, userEmail, token }));
              navigate('/recruiter/recHome', { state: values });
            
          } else if (response.status === 400) {
            setErrorMessage(response.data.message);
          } else {
            console.error('Login failed:', response.data.message);
          }
        }  catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            console.error('Error during login:', error);
            setErrorMessage(error.response?.data?.message || 'An error occurred during login. Please try again.');
          } else {
            setErrorMessage('An unexpected error occurred. Please try again.');
          }
        }
      },
    });
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 relative">
  <img
        src='../../../Images/name.png'
        alt="Logo"
        className="w-24 sm:w-32 md:w-40 lg:w-48 h-auto absolute left-0 ml-4 mb-108 md:mb-96 lg:mb-108"
      />
        <h3 className="text-2xl  text-center text-red-800 mt-4 mb-6">
  Post Your Job For Millions Of People To See
</h3>

      <Box
        sx={{ backgroundColor: 'white', boxShadow: 8, borderRadius: 4, p: 8, width: 'full', maxWidth: '800px' }}
        className="flex flex-col md:flex-row items-center relative"
      >
      

        <div className="order-2 md:order-1 flex flex-col justify-center md:ml-4">
        <Typography component="h3" variant="h5" className="text-xl text-center">
         Sign In To Recruiter
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
              style={{borderRadius:'20px'}}
            >
              Sign In
            </Button>
            <Link to='/' className="mt-4 md:ml-10 inline-block text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out">
              Sign in as a user
            </Link>
            <div className="flex items-center justify-center my-4 mx-auto md:mr-16 md:ml-auto ">
            <div className="w-28 border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="w-28 border-t border-gray-300"></div>
            </div>
            <GoogleOAuthProvider clientId={clientId}>
              <div style={{ maxWidth: '320px', border: '1px solid black',borderRadius:"5px" }}>
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
                borderRadius: '20px',
                border: '1px solid black',
                textTransform:'none'
              }}
             onClick={handleJoin}
            >
              New to careercraze ? join now
            </Button>
          </form>
        </div>
        <img
          src='../../../Images/recruiter.jpg'
          alt="Recruiter"
          className="order-1 md:order-2 w-48 md:w-64 h-auto rounded-xl mt-4 md:mt-0"
          style={{ boxShadow: '-3px 10px 30px rgba(100, 0, 0, 0.5)' }}
        />
      </Box>
    </div>
  );
}

export default RecLogin;
