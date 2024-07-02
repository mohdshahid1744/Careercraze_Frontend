import React from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { axiosUserInstance } from '../../../utils/axios/Axios';

interface ExperienceModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  fetchProfileData: () => void;
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

const ExperienceModal: React.FC<ExperienceModalProps> = ({ open, onClose, userId, fetchProfileData }) => {
  const formik = useFormik({
    initialValues: {
      company: '',
      role: '',
      started: '',
      ended: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const experience = {
          ...values,
          started: new Date(values.started),
          ended: new Date(values.ended),
        };
        await axiosUserInstance.put(`/updateExperience/${userId}`, experience);
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
        <Typography variant="h6" mb={2}>Add Experience</Typography>
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
        </form>
      </Box>
    </Modal>
  );
};

export default ExperienceModal;
