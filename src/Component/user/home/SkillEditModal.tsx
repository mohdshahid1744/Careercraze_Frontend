import React from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { axiosUserInstance } from '../../../utils/axios/Axios';

interface SkillEditProps {
  open: boolean;
  onClose: () => void;
  fetchProfileData: () => void;
  skillDetails: { _id: string; skill: string } | null;
  userId: string;
}

const validationSchema = yup.object({
  skill: yup.string().required('Skill is required'),
});

const SkillEditModal: React.FC<SkillEditProps> = ({ open, onClose, fetchProfileData, skillDetails, userId }) => {
  const formik = useFormik({
    initialValues: {
      skill: skillDetails?.skill || '',
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        console.log("Submitting skill update for userId:", userId, "and skillId:", skillDetails?._id);
        if (skillDetails) {
          const response = await axiosUserInstance.put(`/editSkill/${userId}/${skillDetails._id}`, values);
          console.log("Response:", response.data);
          
          fetchProfileData();
          onClose();
        }
      } catch (error) {
        console.error('Error updating skill:', error);
      }
    },
  });

  const handleDeleteSkill = async () => {
    try {
      if (skillDetails) {
        await axiosUserInstance.delete(`/deleteSkill/${userId}/${skillDetails._id}`);
        fetchProfileData();
        onClose();
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 2, width: 400, mx: 'auto', mt: '20vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="h6" mb={2}>Update Skill</Typography>
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
        </form>
        <Button
          color="error"
          variant="contained"
          fullWidth
          onClick={handleDeleteSkill}
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
          Delete Skill
        </Button>
      </Box>
    </Modal>
  );
};

export default SkillEditModal;
