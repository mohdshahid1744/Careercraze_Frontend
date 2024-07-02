import React from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from "formik";
import * as yup from "yup";
import { axiosUserInstance } from '../../../utils/axios/Axios';

interface ExperienceEditProps {
  open: boolean;
  onClose: () => void;
  fetchProfileData: () => void;
  experienceDetails: { _id: string; company: string, role: string, started: Date, ended: Date  } | null;
  userId: string;
}

const validationSchema = yup.object({
    company: yup.string().required('Company name is required'),
  role: yup.string().required('Role is required'),
  started: yup.date().required('Start date is required').nullable(),
  ended: yup.date()
  .required('End date is required')
  .nullable()
  .min(
    yup.ref('started'),
    'End date cannot be before start date'
  ),
});

const ExperienceEditModal: React.FC<ExperienceEditProps> = ({ open, onClose, fetchProfileData, experienceDetails, userId }) => {
  const formik = useFormik({
    initialValues: {
        company: experienceDetails?.company || '',
        role: experienceDetails?.role || '',
        started: experienceDetails?.started ? new Date(experienceDetails.started).toISOString().split('T')[0] : '',
        ended: experienceDetails?.ended ? new Date(experienceDetails.ended).toISOString().split('T')[0] : '',
    },
    enableReinitialize: true, 
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response=await axiosUserInstance.put(`/editExperience/${userId}/${experienceDetails?._id}`, values);
        console.log("API Response:", response.data);
        
        fetchProfileData();
        onClose();
      } catch (error) {
        console.error('Error updating education:', error);
      }
    },
  });
  const handleDeleteExperience = async () => {
    try {
      if (experienceDetails) {
        await axiosUserInstance.delete(`/deleteExperience/${userId}/${experienceDetails._id}`);
        fetchProfileData();
        onClose();
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 2, width: '90%', maxWidth: '500px', mx: 'auto', mt: '10vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="h6" mb={2}>Update Education</Typography>
        <form onSubmit={formik.handleSubmit}>
        <TextField
            fullWidth
            margin="normal"
            id="company"
            name="company"
            label="Company name"
            value={formik.values.company}
            onChange={formik.handleChange}
            error={formik.touched.company && Boolean(formik.errors.company)}
            helperText={formik.touched.company && formik.errors.company}
          />
          <TextField
            fullWidth
            margin="normal"
            id="role"
            name="role"
            label="Role"
            value={formik.values.role}
            onChange={formik.handleChange}
            error={formik.touched.role && Boolean(formik.errors.role)}
            helperText={formik.touched.role && formik.errors.role}
          />
          <TextField
            fullWidth
            margin="normal"
            id="started"
            name="started"
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formik.values.started}
            onChange={formik.handleChange}
            error={formik.touched.started && Boolean(formik.errors.started)}
            helperText={formik.touched.started && formik.errors.started}
          />
          <TextField
            fullWidth
            margin="normal"
            id="ended"
            name="ended"
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formik.values.ended}
            onChange={formik.handleChange}
            error={formik.touched.ended && Boolean(formik.errors.ended)}
            helperText={formik.touched.ended && formik.errors.ended}
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
          <Button
            color="error"
            variant="contained"
            fullWidth
            onClick={handleDeleteExperience}
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
            Delete Education
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

export default ExperienceEditModal;
