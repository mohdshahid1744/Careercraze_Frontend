import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography, Button, TextField, IconButton } from '@mui/material';
import { adminLogout } from '../../Redux/Slice/adminSlice';
import { useDispatch } from 'react-redux';
import { axiosUserInstance } from '../../utils/axios/Axios';
import SkillEditModal from './EditSkillModal';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface Skill {
  _id: string;
  skill: string;
}

const validationSchema = yup.object({
    newSkill: yup
      .string()
      .trim('Skill cannot be empty')
      .required('Skill is required')
      .min(2, 'Skill should be of minimum 2 characters length')
      .test('is-not-blank', 'Skill cannot be only spaces', (value) => value?.trim().length > 0),
  });

function SkillManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editSkill, setEditSkill] = useState<Skill | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const menuItems = [
    { text: 'Dashboard', onClick: () => navigate('/admin/dashboard') },
    { text: 'User', onClick: () => navigate('/admin/user') },
    { text: 'Recruiter', onClick: () => navigate('/admin/recruiter') },
    { text: 'Skill', onClick: () => navigate('/admin/skill') },
    { text: 'Post', onClick: () => navigate('/admin/post') },
  ];


  const handleLogout = () => {
    dispatch(adminLogout());
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const fetchSkills = async () => {
    try {
      const response = await axiosUserInstance.get('getskills');
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const formik = useFormik({
    initialValues: {
      newSkill: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axiosUserInstance.post('/addskills', { skill: values.newSkill });
        setSkills([...skills, response.data]);
        resetForm();
      } catch (error) {
        console.error('Error adding skill:', error);
      }
    },
  });

  const handleEditSkill = (skill: Skill) => {
    setEditSkill(skill);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditSkill(null);
  };

  const fetchProfileData = () => {
    fetchSkills();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Drawer
        variant="permanent"
        className="w-60"
        classes={{ paper: 'w-60 box-border bg-white shadow-md' }}
      >
        <Toolbar />
        <div className="overflow-auto">
          <List>
            {menuItems.map((item, index) => (
              <ListItem button key={index} onClick={item.onClick}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
      <div className="flex flex-col flex-grow">
        <AppBar position="static" className="bg-blue-600">
          <Toolbar>
            <Typography variant="h6" className="flex-grow">
              Skill Management
            </Typography>
            <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <div className="p-6 bg-white shadow-md rounded-lg m-4">
          <Typography variant="h5" className="mb-4">Add a New Skill</Typography>
          <form onSubmit={formik.handleSubmit} className="flex items-center space-x-4">
            <TextField
              label="New Skill"
              variant="outlined"
              id="newSkill"
              name="newSkill"
              value={formik.values.newSkill}
              onChange={formik.handleChange}
              error={formik.touched.newSkill && Boolean(formik.errors.newSkill)}
              helperText={formik.touched.newSkill && formik.errors.newSkill}
              fullWidth
              required
              className="mb-4"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
            >
              Add Skill
            </Button>
          </form>
          <div className="mt-6">
            <Typography variant="h6">Added Skills</Typography>
            <List>
              {skills.map((skill, index) => (
                <ListItem
                  key={index}
                  className="bg-gray-100 mb-2 rounded-lg shadow-sm flex justify-between items-center"
                >
                  <ListItemText primary={skill.skill} />
                  <IconButton onClick={() => handleEditSkill(skill)} color="primary">
                    <EditIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </div>
        </div>
      </div>
      <SkillEditModal
        open={modalOpen}
        onClose={handleCloseModal}
        fetchProfileData={fetchProfileData}
        skillDetails={editSkill}
      />
    </div>
  );
}

export default SkillManagement;
