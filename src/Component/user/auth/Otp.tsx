import React, { useRef, useState, useEffect } from 'react';
import { Button, TextField, Typography, Box, Grid, Snackbar, Alert } from '@mui/material';
import { axiosInstance } from '../../../utils/axios/Axios';
import { useLocation } from 'react-router-dom';
import {  useNavigate } from 'react-router-dom';

function Otp() {
  const otpRef = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | null>(null);
  const [resendStatus, setresendStatus] = useState<'success' | 'error' | null>(null);
  const [openVerifySnackbar, setOpenVerifySnackbar] = useState(false);
  const [openResendSnackbar, setOpenResendSnackbar] = useState(false);
  const location = useLocation();
  const user = location.state || { name: "", email: "", mobile: "", password: "" };
  const navigate=useNavigate()

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const { value } = e.target as HTMLInputElement;
    if (value.length === 1 && index < 5) {
      otpRef.current[index + 1]?.focus();
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'Backspace' && index > 0 && !otpRef.current[index]?.value) {
      otpRef.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    setTimer(60);
    try {
      const response = await axiosInstance.post('/resendOTP', { email: user.email });
      console.log("Resend OTP RESPONSE:", response);
      if (response.status === 201) {
        setOpenResendSnackbar(true);
        setresendStatus('success'); 
      } else {
        console.error('Failed to resend OTP:', response.data.message);
      }
    } catch (error) {
      console.error('Error during resend OTP:', error);
    }
  };
  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    console.log('Entered OTP:', enteredOtp);
    try {
      const response = await axiosInstance.patch('/verifyOtp', {
        otp: enteredOtp,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        password: user.password
      });
      console.log("RESPONSE:", response);
      if (response.status === 200) {
        setVerificationStatus('success');
        setTimeout(()=>{
          navigate('/')
        },2000)
      } else {
        setVerificationStatus('error');
      }
    } catch (error) {
      setVerificationStatus('error');
    }
    setOpenVerifySnackbar(true);
  };

  const handleResendCloseSnackbar = () => {
    setOpenResendSnackbar(false);
  };
  const handleVerifyCloseSnackbar = () => {
    setOpenVerifySnackbar(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
      <Box bgcolor="white" p={6} borderRadius={4} boxShadow={8} width={450} height={550}>
        <Typography variant="h5" fontWeight="bold" align="center" mb={4}>
          Verification Code
        </Typography>
        <h5 style={{ color: 'gray', fontSize: '10px', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px', margin: '20px 0' }}>
          We have sent the verification code to your email address
        </h5>
        <img
          src="../../../Images/OTP.jpg"
          alt="OTP Illustration"
          style={{
            display: 'block',
            margin: '0 auto 20px auto',
            width: '80%',
            maxHeight: '200px',
            objectFit: 'contain',
            borderRadius: '10px',
            boxShadow: '-3px 10px 30px rgba(0, 0, 0, 0.3)'
          }}
        />
        <form>
          <Grid container spacing={2} justifyContent="center" mb={4}>
            {Array(6).fill("").map((_, index) => (
              <Grid item key={index} >
                <TextField
                  variant="outlined"
                  inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                  sx={{
                    width: 40,
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: 'orange',
                      },
                    },
                  }}
                  required
                  inputRef={el => otpRef.current[index] = el}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              </Grid>
            ))}
          </Grid>

          <Button
            type="button"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ borderRadius: 5, marginBottom: 2, backgroundColor: '#FFA500' }}
            onClick={handleVerifyOtp}
          >
            Verify OTP
          </Button>

          <Button
            type="button"
            variant="contained"
            fullWidth
            sx={{ borderRadius: 5, backgroundColor: 'black' }}
            disabled={timer > 0}
            onClick={handleResendOtp}
          >
            {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
          </Button>
        </form>
      </Box>

      <Snackbar open={openVerifySnackbar} autoHideDuration={6000} onClose={handleVerifyCloseSnackbar}>
        <Alert onClose={handleVerifyCloseSnackbar} severity={verificationStatus === 'success' ? 'success' : 'error'} sx={{ width: '100%' }}>
          {verificationStatus === 'success' ? 'OTP Verified Successfully!' : 'Incorrect OTP. Please try again.'}
        </Alert>
      </Snackbar>
      <Snackbar open={openResendSnackbar} autoHideDuration={6000} onClose={handleResendCloseSnackbar}>
        <Alert onClose={handleResendCloseSnackbar} severity={resendStatus === 'success' ? 'success' : 'error'} sx={{ width: '100%' }}>
          {resendStatus === 'success' ? 'OTP Resend Successfully!' : 'Failed to Resent Otp'}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Otp;
