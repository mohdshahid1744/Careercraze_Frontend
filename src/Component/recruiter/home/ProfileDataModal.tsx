import React from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from "formik";
import * as yup from "yup";
import { axiosUserInstance } from '../../../utils/axios/Axios';

interface ProfileDataProps {
  open: boolean;
  onClose: () => void;
  fetchProfileData: () => void;
  userDetails: { name: string, mobile: string ,companyEmail:string,companyName:string} | null;
  userId: string;
}

const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    mobile: yup.string().required('Mobile number is required').matches(/^[0-9]+$/, 'Mobile number is not valid'),
    companyName: yup.string().required('Title is required'),
  companyEmail:yup.string().required('Company Email is required')
});

const ProfileData: React.FC<ProfileDataProps> = ({ open, onClose, fetchProfileData, userDetails, userId }) => {
  const formik = useFormik({
    initialValues: {
        name: userDetails?.name || '',
        mobile: userDetails?.mobile || '',
        companyName: userDetails?.companyName || '',
      companyEmail: userDetails?.companyEmail || '',
    },
    enableReinitialize: true, 
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await axiosUserInstance.put(`/recruiter/updateProfileData/${userId}`, values);
        fetchProfileData();
        onClose();
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 2, width: 400, mx: 'auto', mt: '20vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="h6" mb={2}>Update Profile</Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            id="name"
            name="name"
            label="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            fullWidth
            margin="normal"
            id="mobile"
            name="mobile"
            label="Mobile"
            value={formik.values.mobile}
            onChange={formik.handleChange}
            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
            helperText={formik.touched.mobile && formik.errors.mobile}
          />
          <TextField
            fullWidth
            margin="normal"
            id="companyName"
            name="companyName"
            label="Company Name"
            value={formik.values.companyName}
            onChange={formik.handleChange}
            error={formik.touched.companyName && Boolean(formik.errors.companyName)}
            helperText={formik.touched.companyName && formik.errors.companyName}
          />
               <TextField
            fullWidth
            margin="normal"
            id="companyEmail"
            name="companyEmail"
            label="Company Email"
            value={formik.values.companyEmail}
            onChange={formik.handleChange}
            error={formik.touched.companyEmail && Boolean(formik.errors.companyEmail)}
            helperText={formik.touched.companyEmail && formik.errors.companyEmail}
          />
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            sx={{
              mt: 2,
              background: 'linear-gradient(45deg, #FE6B8C 30%, #FF8E53 90%)',
              color: 'white', 
              '&:hover': {
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                opacity: 0.8, 
              },
            }}
          >
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

export default ProfileData;
