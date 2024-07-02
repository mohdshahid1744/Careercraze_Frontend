import React from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from "formik";
import * as yup from "yup";
import { axiosUserInstance } from '../../utils/axios/Axios';

interface SkillEditProps {
  open: boolean;
  onClose: () => void;
  fetchProfileData: () => void;
  skillDetails: { _id: string; skill:string } | null;
  
}

const validationSchema = yup.object({
    skill: yup.string().required('skill is required'),
});

const SkillEditModal: React.FC<SkillEditProps> = ({ open, onClose, fetchProfileData, skillDetails }) => {
  const formik = useFormik({
    initialValues: {
        skill: skillDetails?.skill || '',
       
    },
    enableReinitialize: true, 
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axiosUserInstance.put(`/editedskill/${skillDetails?._id}`, values);
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
      if (skillDetails) {
        await axiosUserInstance.delete(`/deleteskilled/${skillDetails._id}`);
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
            id="skill"
            name="skill"
            label="Skill"
            value={formik.values.skill}
            onChange={formik.handleChange}
            error={formik.touched.skill && Boolean(formik.errors.skill)}
            helperText={formik.touched.skill && formik.errors.skill}
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

export default SkillEditModal;