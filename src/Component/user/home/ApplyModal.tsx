import React from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface ApplyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; mobile: string; cv: File }) => void;
}

interface FormValues {
  name: string;
  email: string;
  mobile: string;
  cv: File | null;
}

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().required('Email is required').email('Enter a valid email'),
  mobile: yup
    .string()
    .required('Mobile number is required')
    .matches(/^[0-9]+$/, 'Mobile number is not valid'),
  cv: yup.mixed().required('CV is required'),
});

const ApplyModal: React.FC<ApplyModalProps> = ({ open, onClose, onSubmit }) => {
  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      email: '',
      mobile: '',
      cv: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (values.cv) {
        onSubmit({
          name: values.name,
          email: values.email,
          mobile: values.mobile,
          cv: values.cv,
        });
        onClose();
      } else {
        formik.setFieldError('cv', 'CV is required');
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      formik.setFieldValue('cv', event.currentTarget.files[0]);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          bgcolor: 'white',
          borderRadius: 2,
          width: 400,
          mx: 'auto',
          mt: '20vh',
        }}
      >
        <Typography variant="h6" mb={2}>
          Apply for Job
        </Typography>
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
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
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
          <div>
            <h4>Upload your CV</h4>
          </div>
          <input
            id="cv"
            name="cv"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ marginTop: '16px' }}
          />
          {formik.touched.cv && formik.errors.cv && (
            <Typography color="error" variant="body2">
              {formik.errors.cv}
            </Typography>
          )}
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

export default ApplyModal;
