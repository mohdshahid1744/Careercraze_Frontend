import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Autocomplete } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { axiosUserInstance } from '../../../utils/axios/Axios';

interface SkillsModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  fetchProfileData: () => void;
}

const validationSchema = yup.object({
  skill: yup.string().required('Skill is required'),
});

const SkillModal: React.FC<SkillsModalProps> = ({ open, onClose, userId, fetchProfileData }) => {
  const [skillOptions, setSkillOptions] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      skill: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setErrorMessage(null); 

      try {
        const response = await axiosUserInstance.put(`/updateSkill/${userId}`, values);

        if (response.data.status === 403 && response.data.message === 'Skill already added') {
          setErrorMessage('This skill is already added');
          return;
        }

        fetchProfileData();
        onClose();
      } catch (error) {
        console.error('Error adding skills:', error);
        setErrorMessage('An error occurred while adding the skill');
      }
    },
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axiosUserInstance.get('/getskills');
        setSkillOptions(response.data.map((skill: any) => skill.skill)); 
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    if (open) { 
      fetchSkills();
      setErrorMessage(null);
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 2, width: 400, mx: 'auto', mt: '20vh' }}>
        <Typography variant="h6" mb={2}>Add Skill</Typography>
        {errorMessage && (
          <Typography color="error" mb={2}>{errorMessage}</Typography>
        )}
        <form onSubmit={formik.handleSubmit}>
          <Autocomplete
            freeSolo
            options={skillOptions}
            onChange={(event, value) => formik.setFieldValue('skill', value)}
            renderInput={(params) => (
              <TextField
                {...params}
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
            )}
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

export default SkillModal;
