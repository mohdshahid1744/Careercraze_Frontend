import React,{useState} from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import { axiosRecruiterInstance } from '../../../utils/axios/Axios';
import { useFormik } from "formik";
import { Link, useNavigate } from 'react-router-dom';
import * as yup from "yup";
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
   companyName: yup
   .string()
   .required("Company Name is required")
   .test("no-spaces", "Company Name should not contain only spaces", (value) => {
     return value ? !(/^\s+$/.test(value)) : false;
   }),
   companyEmail: yup
 .string()
 .email("Invalid email address")
 .required("Email is required"),
   password: yup
   .string()
   .min(6, "Password must be at least 6 characters")
   .required("Password is required"),
 confirmPassword: yup
   .string()
   .oneOf([yup.ref("password")], "Passwords must match")
   .required("Confirm Password is required")
});
function RecSignup() {
  const navigate=useNavigate()
  
  const [signupError, setSignupError] = useState('');
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      mobile: '',
      companyEmail:'',
      companyName:'',
      password: '',
      confirmPassword: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axiosRecruiterInstance.post('/recruiter/recSignup', values);
        if (response.status === 201) {
          navigate('/recruiter/recOtp', { state: values });
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
        sx={{ backgroundColor: 'white', boxShadow: 8, borderRadius: 4, p: 8, width: 'full', maxWidth: '95vw' }}
        className="flex flex-col md:flex-row items-center relative"
      >
        <img
          src='../../../Images/logo.png'
          alt="Logo"
          className="w-16 h-auto absolute top-0 left-0 ml-4 mt-4"
        />

        <div className="order-2 md:order-1 flex flex-col justify-center md:ml-4">
          <Typography component="h1" variant="h5" className="text-2xl font-bold text-center mb-4">
            Sign Up As Recruiter
          </Typography>
          
          <form className="mt-4" onSubmit={formik.handleSubmit}>
            <TextField
              variant="outlined"
              required
              id="name"
              label="Name"
              name="name"
              size="small"
              className="w-80 md:w-90 mb-4"
              autoComplete="name"
              InputProps={{ style: { borderRadius: '10px' } }}
              sx={{ marginBottom: '16px',marginLeft:'10px' }}
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
              sx={{ marginBottom: '16px' ,marginLeft:'10px'}}
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
              sx={{ marginBottom: '16px',marginLeft:'10px' }}
              autoFocus
              value={formik.values.mobile}
              onChange={formik.handleChange}
              error={formik.touched.mobile && Boolean(formik.errors.mobile)}
              helperText={formik.touched.mobile && formik.errors.mobile}
            />
                  <TextField
              variant="outlined"
              required
              id="companyEmail"
              label="Company Email"
              name="companyEmail"
              size="small"
              className="w-80 md:w-88 mb-4"
              autoComplete="companyEmail"
              InputProps={{
                style: { borderRadius: '10px' }
              }}
              sx={{ marginBottom: '16px' ,marginLeft:'10px'}}
              autoFocus
              value={formik.values.companyEmail}
              onChange={formik.handleChange}
              error={formik.touched.companyEmail && Boolean(formik.errors.companyEmail)}
              helperText={formik.touched.companyEmail && formik.errors.companyEmail}
            />
                  <TextField
              variant="outlined"
              required
              id="companyName"
              label="Company Name"
              name="companyName"
              size="small"
              className="w-80 md:w-88 mb-4"
              autoComplete="companyName"
              InputProps={{
                style: { borderRadius: '10px' }
              }}
              sx={{ marginBottom: '16px',marginLeft:'10px' }}
              autoFocus
              value={formik.values.companyName}
              onChange={formik.handleChange}
              error={formik.touched.companyName && Boolean(formik.errors.companyName)}
              helperText={formik.touched.companyName && formik.errors.companyName}
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
              sx={{ marginBottom: '16px',marginLeft:'10px' }}
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
              autoComplete="confirmPassword"
              className="w-80 md:w-88 mb-4"
              InputProps={{
                style: { borderRadius: '10px' }
              }}
              sx={{ marginBottom: '16px',marginLeft:'10px' }}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />
           <Button
              type="submit"
              variant="contained"
              color="primary"
              className="w-full md:w-88 mb-4"
              style={{ borderRadius:'20px' }}
            >
              Join now
            </Button>

            <div className="flex items-center justify-center my-4">
              <div className="w-28 border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">or</span>
              <div className="w-28 border-t border-gray-300"></div>
            </div>

          
            <Link to="/recruiter/reclogin" className="mt-4 md:ml-auto md:mr-auto flex items-center justify-center">
            Already have an account? <span className="underline">Login</span>
            </Link>

          </form>
        </div>

        <img
          src='../../../Images/RecSignup.jpg'
          alt="Front"
          className="order-1 md:order-2 w-64 md:w-96 h-auto rounded-xl mt-4 md:mt-0"
          style={{ boxShadow: '-3px 10px 30px rgba(0, 0, 0, 0.5)' }}
        />
      </Box>
    </div>
  );
}

export default RecSignup;