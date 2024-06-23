import React from 'react';
import { Modal, Box, TextField, Button, Typography, Autocomplete } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface SkillsModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (education: { skill: string }) => void;
}

const skillOptions = [
  'JavaScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'C++',
  'HTML',
  'CSS',
  'SQL',
  'NoSQL'
];

const validationSchema = yup.object({
  skill: yup.string().required('Skill is required'),
});

const SkillModal: React.FC<SkillsModalProps> = ({ open, onClose, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      skill: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit({
        ...values
      });
      onClose();
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 2, width: 400, mx: 'auto', mt: '20vh' }}>
        <Typography variant="h6" mb={2}>Add Skill</Typography>
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
