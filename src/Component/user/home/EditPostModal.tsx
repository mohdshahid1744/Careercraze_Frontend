import React from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { axiosUserInstance } from '../../../utils/axios/Axios';

interface PostEditProps {
  open: boolean;
  onClose: () => void;
  fetchProfileData: () => void;
  postDetails: { _id: string; description: string } | null;
  onPostUpdated: (updatedPost: { _id: string; description: string }) => void; // New prop
}

const validationSchema = yup.object({
  description: yup.string().required('Description is required'),
});

const PostEditModal: React.FC<PostEditProps> = ({ open, onClose, fetchProfileData, postDetails, onPostUpdated }) => {
  const [error, setError] = React.useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      description: postDetails?.description || '',
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (postDetails) {
          const response = await axiosUserInstance.put(`/edit/${postDetails._id}`, values);
          console.log("Response:", response.data);
          fetchProfileData();
          onClose();
          onPostUpdated({ ...postDetails, description: values.description }); // Call the callback with updated post
        }
      } catch (error) {
        console.error('Error updating post:', error);
        setError('Failed to update the post. Please try again.');
      }
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        p: 4,
        bgcolor: 'white',
        borderRadius: 2,
        width: 400,
        mx: 'auto',
        mt: '20vh',
        boxShadow: 24,
        outline: 0
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="h6" mb={2}>Update Post</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            id="description"
            name="description"
            label="Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
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

export default PostEditModal;
