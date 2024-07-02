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
  userDetails: { title: string, name: string, mobile: string } | null;
  userId: string;
}

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  name: yup.string().required('Name is required'),
  mobile: yup.string().required('Mobile number is required').matches(/^[0-9]+$/, 'Mobile number is not valid'),
});

const ProfileData: React.FC<ProfileDataProps> = ({ open, onClose, fetchProfileData, userDetails, userId }) => {
  const formik = useFormik({
    initialValues: {
      title: userDetails?.title || '',
      name: userDetails?.name || '',
      mobile: userDetails?.mobile || '',
    },
    enableReinitialize: true, 
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("VANOOO:",values);
      
      try {
        const response=await axiosUserInstance.put(`/updateProfileData/${userId}`, values);
        
       
        console.log("API Response:", response.data);
        fetchProfileData();
        onClose();
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    },
  });

  console.log("DSF",formik);
  console.log("SDF",userId);
  
  

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
            id="title"
            name="title"
            label="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
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
