import React from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { useFormik } from "formik";
import * as yup from "yup";
import { axiosUserInstance } from '../../../utils/axios/Axios';
interface EducationModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  fetchProfileData: () => void;
}

const validationSchema = yup.object({
  school: yup.string().required('School is required'),
  degree: yup.string().required('Degree is required'),
  field: yup.string().required('Field of study is required'),
  started: yup.date().required('Start date is required').nullable(),
  ended: yup.date()
    .required('End date is required')
    .nullable()
    .min(
      yup.ref('started'),
      'End date cannot be before start date'
    ),
});


const EducationModal: React.FC<EducationModalProps> = ({ open, onClose, userId, fetchProfileData }) => {
  const formik = useFormik({
    initialValues: {
      school: '',
      degree: '',
      field: '',
      started: '',
      ended: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const education = {
          ...values,
          started: new Date(values.started),
          ended: new Date(values.ended),
        };
        await axiosUserInstance.put(`/updateEducation/${userId}`, education);
        fetchProfileData();
      } catch (error) {
        console.error('Error adding experience:', error);
      } finally {
        onClose();
      }
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 2, width: 400, mx: 'auto', mt: '20vh' }}>
        <Typography variant="h6" mb={2}>Add Education</Typography>
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
         <Button color="primary"variant="contained"
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

export default EducationModal;
