import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Box,useMediaQuery,Drawer,List,ListItem,ListItemText, Typography, InputLabel, Select, MenuItem, AppBar, Grid, Toolbar,IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { axiosRecruiterInstance } from '../../../utils/axios/Axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { recruiterLogout } from '../../../Redux/Slice/recruiterSlice';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { RootState } from '../../../Redux/Store/Store';
import { keyframes } from '@emotion/react';
import { Theme } from '@mui/material/styles';

const validationSchema = yup.object({
  jobrole: yup.string().required('Job Role is required'),
  companyname: yup.string().required('Company Name is required'),
  minexperience: yup.number().required('Min Experience is required').min(0, 'Min Experience must be greater than 0'),
  maxexperience: yup.number().required('Max Experience is required').min(yup.ref('minexperience'), 'Max Experience must be greater than Min Experience'),
  minsalary: yup.number().required('Min Salary is required').min(0, 'Min Salary must be greater than 0').min(yup.ref('minsalary'), 'Max Salary must be greater than Min Salary'),
  joblocation: yup.string().required('Job Location is required'),
  emptype: yup.string().required('Employment Type is required'),
  skills: yup.string().required('Skills are required'),
  description: yup.string().required('Description is required'),
  companylogo: yup.mixed().nullable().required('Image is required')
});
const clickAnimation = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(180deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
`;

const EditJob = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [companylogo, setCompanylogo] = useState<File | null>(null);
  const [showImage, setShowImage] = useState(window.innerWidth >= 1500);
  const userId = useSelector((store: RootState) => store.recruiter.UserId);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageSize, setImageSize] = useState('100%');
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 900 && width <= 1100) {
        setImageSize('70%'); 
        setShowImage(true);
      } else if (width > 1100) {
        setImageSize('100%'); 
        setShowImage(true);
      } else {
        setShowImage(false); 
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const handleClick = () => {
    setIsAnimating(true);
    handleDrawerToggle();
    setTimeout(() => setIsAnimating(false), 300); 
  };
    const handleDrawerToggle = () => {
      setDrawerOpen(!drawerOpen);
    };
  const handleLogout = () => {
    dispatch(recruiterLogout());
    localStorage.removeItem('recruiterToken');
    navigate('/recruiter/recLogin');
  };

  const handleHome = () => {
    navigate('/recruiter/recHome');
  };

  useEffect(() => {
    const handleResize = () => {
      setShowImage(window.innerWidth >= 1200);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const formik = useFormik({
    initialValues: {
      jobrole: '',
      companyname: '',
      minexperience: '',
      maxexperience: '',
      minsalary: '',
      maxsalary: '',
      joblocation: '',
      emptype: '',
      skills: '',
      description: '',
      companylogo: null as File | null
    },
    enableReinitialize: true, 
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const jobData = new FormData();

      (Object.keys(values) as (keyof typeof values)[]).forEach(key => {
        if (values[key] !== null) {
          jobData.append(key, values[key] as Blob | string);
        }
      });

      if (userId) {
        jobData.append('recruiterId', userId);
      }

      try {
        const response = await axiosRecruiterInstance.post(`/recruiter/update/${id}`, jobData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 200) {
          navigate('/recruiter/recHome');
        }
      } catch (error) {
        console.error('Error updating job:', error);
      }
    }
  });

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await axiosRecruiterInstance.get(`/recruiter/getsingle/${id}`);
        const jobData = response.data;
        formik.setValues({
          jobrole: jobData.jobrole,
          companyname: jobData.companyname,
          minexperience: jobData.minexperience,
          maxexperience: jobData.maxexperience,
          minsalary: jobData.minsalary,
          maxsalary: jobData.maxsalary,
          joblocation: jobData.joblocation,
          emptype: jobData.emptype,
          skills: jobData.skills,
          description: jobData.description,
          companylogo: null
        });
        setCompanylogo(jobData.companylogo);
      } catch (error) {
        console.error('Error fetching job data:', error);
      }
    };
    fetchJobData();
  }, [id]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file && !file.type.startsWith('image/')) {
      formik.setFieldError('companylogo', 'File must be an image');
    } else {
      setCompanylogo(file);
      formik.setFieldValue('companylogo', file);
    }
  };
  const handleNewJob = () => {
    navigate('/recruiter/newjob');
  };
  const handleProfile = () => {
    if (userId) {
      navigate(`/recruiter/profile/${userId}`);
    }
  };
  const menuItems = (
    <>
      <ListItem button onClick={handleHome}>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button onClick={handleNewJob}>
        <ListItemText primary="New Job" />
      </ListItem>
      <ListItem button onClick={handleProfile}>
        <ListItemText primary="Profile" />
      </ListItem>
      <ListItem button onClick={handleLogout}>
        <ListItemText primary="Logout" />
      </ListItem>
    </>
  );
  return (
    <Box sx={{ backgroundColor: 'beige' }}>
       <>
      <AppBar position="static" sx={{ height: '85px', backgroundColor: 'white', marginBottom: '10px' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <img
        src="../../../Images/logo.png"
        alt="Logo"
        style={{
          position: 'absolute',
          top: isSmallScreen ? '20px' : '20px',
          left: isSmallScreen ? '0px' : '10px',
          width: isSmallScreen ? '40px' : '60px', 
          height: 'auto',
        }}
      />
          </Typography>
          {isSmallScreen ? (
        <IconButton
          edge="start"
          color="primary"
          aria-label="menu"
          onClick={handleClick}
          sx={{
            zIndex: 1300,
            position: 'relative',
            transition: 'color 0.3s ease',
            animation: isAnimating ? `${clickAnimation} 0.3s` : 'none',
            '&:hover': {
              color: '#ff5722', 
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      ):(
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button
                  sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }}
                  onClick={handleHome}
                >
                  <img src="../../../Images/Home.png" alt="Home Icon" style={{ width: '30px', height: '30px' }} />
                  <Typography variant="caption">Home</Typography>
                </Button>
              </Grid>
              <Grid item></Grid>
              <Grid item>
                  <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleNewJob}>
                    <img src='../../../Images/newjob.png' alt="New Job Icon" style={{ width: '30px', height: '30px' }} />
                    <Typography variant="caption">New Job</Typography>
                  </Button>
                </Grid>
              <Grid item>
                <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }}>
                  <img src="../../../Images/Profile.png" alt="Profile Icon" style={{ width: '30px', height: '30px' }} />
                  <Typography variant="caption">Me</Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button
                  sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }}
                  onClick={handleLogout}
                >
                  <img src="../../../Images/logout.png" alt="Logout Icon" style={{ width: '30px', height: '30px' }} />
                  <Typography variant="caption">Logout</Typography>
                </Button>
              </Grid>
            </Grid>
          </Box>
      )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
           <Box
             sx={{ width: 250 }}
             role="presentation"
             onClick={handleDrawerToggle}
             onKeyDown={handleDrawerToggle}
           >
             <List>
               {menuItems}
             </List>
           </Box>
         </Drawer>
         </>
      <Container maxWidth="lg">
        <Box
          sx={{ backgroundColor: 'white', boxShadow: 8, borderRadius: 4, p: 8, width: 'full', maxWidth: '95vw' }}
          className="flex flex-col md:flex-row items-center relative"
        >
                 <Box sx={{ mt: 4, mb: 4, width: { xs: '100%', md: '40%' } }}> 
            <Typography variant="h4" component="h1" gutterBottom>
              Edit Job
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Job Role"
                  name="jobrole"
                  required
                  value={formik.values.jobrole}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.jobrole && Boolean(formik.errors.jobrole)}
                  helperText={formik.touched.jobrole && formik.errors.jobrole}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="companyname"
                  required
                  value={formik.values.companyname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.companyname && Boolean(formik.errors.companyname)}
                  helperText={formik.touched.companyname && formik.errors.companyname}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Min Experience"
                  name="minexperience"
                  required
                  type="number"
                  value={formik.values.minexperience}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.minexperience && Boolean(formik.errors.minexperience)}
                  helperText={formik.touched.minexperience && formik.errors.minexperience}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Max Experience"
                  name="maxexperience"
                  required
                  type="number"
                  value={formik.values.maxexperience}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.maxexperience && Boolean(formik.errors.maxexperience)}
                  helperText={formik.touched.maxexperience && formik.errors.maxexperience}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Min Salary"
                  name="minsalary"
                  required
                  type="number"
                  value={formik.values.minsalary}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.minsalary && Boolean(formik.errors.minsalary)}
                  helperText={formik.touched.minsalary && formik.errors.minsalary}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Max Salary"
                  name="maxsalary"
                  required
                  type="number"
                  value={formik.values.maxsalary}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.maxsalary && Boolean(formik.errors.maxsalary)}
                  helperText={formik.touched.maxsalary && formik.errors.maxsalary}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Job Location"
                  name="joblocation"
                  required
                  value={formik.values.joblocation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.joblocation && Boolean(formik.errors.joblocation)}
                  helperText={formik.touched.joblocation && formik.errors.joblocation}
                />
              </Box>
              <Box mb={2}>
                <InputLabel id="emptype-label">Employment Type</InputLabel>
                <Select
                  labelId="emptype-label"
                  id="emptype"
                  name="emptype"
                  value={formik.values.emptype}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.emptype && Boolean(formik.errors.emptype)}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="Full-time">Full-time</MenuItem>
                  <MenuItem value="Part-time">Part-time</MenuItem>
                  <MenuItem value="Contract">Contract</MenuItem>
                </Select>
                {formik.touched.emptype && formik.errors.emptype ? (
                  <Typography color="error">{formik.errors.emptype}</Typography>
                ) : null}
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Skills"
                  name="skills"
                  required
                  value={formik.values.skills}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.skills && Boolean(formik.errors.skills)}
                  helperText={formik.touched.skills && formik.errors.skills}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  required
                  multiline
                  rows={4}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Box>
              <Box mb={2}>
                <InputLabel htmlFor="companylogo">Company Logo</InputLabel>
                <input
                  id="companylogo"
                  name="companylogo"
                  type="file"
                  onChange={handleImageChange}
                  onBlur={formik.handleBlur}
                  style={{ display: 'block', margin: '10px 0' }}
                />
                {formik.touched.companylogo && formik.errors.companylogo ? (
                  <Typography color="error">{formik.errors.companylogo}</Typography>
                ) : null}
                {companylogo && (
                  <Box mt={2}>
                    <img src={URL.createObjectURL(companylogo)} alt="Company Logo" style={{ width: '100px', height: '100px' }} />
                  </Box>
                )}
              </Box>
              <Button color="primary" variant="contained" type="submit" disabled={formik.isSubmitting}>
                Update Job
              </Button>
            </form>
            {showImage && (
              <img
                src='../../../Images/newjob.jpg'
                alt="Front"
                className="order-1 md:order-2 w-full md:w-128 h-auto rounded-xl mt-4 md:mt-0 absolute"
                style={{
                  boxShadow: '-3px 10px 30px rgba(0, 0, 0, 0.5)',
                  top: '45%',
                  right: '30%',
                  transform: 'translate(50%, -50%)',
                  maxWidth: '500px',
                  zIndex: '0',
                  width: imageSize, 
                }}
              />
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default EditJob;
