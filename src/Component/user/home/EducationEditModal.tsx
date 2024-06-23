import React from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from "formik";
import * as yup from "yup";
import { axiosUserInstance } from '../../../utils/axios/Axios';

interface EducationEditProps {
  open: boolean;
  onClose: () => void;
  fetchProfileData: () => void;
  educationDetails: { _id: string; school: string, degree: string, field: string, started: Date, ended: Date  } | null;
  userId: string;
}

const validationSchema = yup.object({
    school: yup.string().required('School is required'),
    degree: yup.string().required('Degree is required'),
    field: yup.string().required('Field of study is required'),
    started: yup.date().required('Start date is required').nullable(),
    ended: yup.date().required('End date is required').nullable(),
});

const EducationEditModal: React.FC<EducationEditProps> = ({ open, onClose, fetchProfileData, educationDetails, userId }) => {
  const formik = useFormik({
    initialValues: {
        school: educationDetails?.school || '',
        degree: educationDetails?.degree || '',
        field: educationDetails?.field || '',
        started: educationDetails?.started ? new Date(educationDetails.started).toISOString().split('T')[0] : '',
        ended: educationDetails?.ended ? new Date(educationDetails.ended).toISOString().split('T')[0] : '',
    },
    enableReinitialize: true, 
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axiosUserInstance.put(`/editEducation/${userId}/${educationDetails?._id}`, values);
        console.log("API Response:", response.data);
        fetchProfileData();
        onClose();
      } catch (error) {
        console.error('Error updating education:', error);
      }
    },
  });

  const handleDeleteEducation = async () => {
    try {
      if (educationDetails) {
        await axiosUserInstance.delete(`/deleteEducation/${userId}/${educationDetails._id}`);
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
          <Typography variant="h6" mb={2}>Update Education</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            id="school"
            name="school"
            label="School"
            value={formik.values.school}
            onChange={formik.handleChange}
            error={formik.touched.school && Boolean(formik.errors.school)}
            helperText={formik.touched.school && formik.errors.school}
          />
          <TextField
            fullWidth
            margin="normal"
            id="degree"
            name="degree"
            label="Degree"
            value={formik.values.degree}
            onChange={formik.handleChange}
            error={formik.touched.degree && Boolean(formik.errors.degree)}
            helperText={formik.touched.degree && formik.errors.degree}
          />
          <TextField
            fullWidth
            margin="normal"
            id="field"
            name="field"
            label="Field"
            value={formik.values.field}
            onChange={formik.handleChange}
            error={formik.touched.field && Boolean(formik.errors.field)}
            helperText={formik.touched.field && formik.errors.field}
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
            onClick={handleDeleteEducation}
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

export default EducationEditModal;

