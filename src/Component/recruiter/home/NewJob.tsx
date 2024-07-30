import React, { useState, useEffect } from 'react';
import {Container,TextField,Button,Box,Typography,InputLabel,Select,MenuItem,AppBar,Grid,Toolbar,SelectChangeEvent} from '@mui/material';
import { axiosRecruiterInstance } from '../../../utils/axios/Axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { recruiterLogout } from '../../../Redux/Slice/recruiterSlice';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSelector } from 'react-redux'
import { RootState } from '../../../Redux/Store/Store'


const validationSchema = yup.object({
  jobrole: yup.string().required('Job Role is required'),
  companyname: yup.string().required('Company Name is required'),
  minexperience: yup.number().required('Min Experience is required').min(0, 'Min Experience must be greater than 0'),
  maxexperience: yup.number().required('Max Experience is required')
    .min(yup.ref('minexperience'), 'Max Experience must be greater than Min Experience'),
  minsalary: yup.number().required('Min Salary is required').min(0, 'Min Salary must be greater than 0'),
  maxsalary: yup.number().required('Max Salary is required').min(0, 'Max Salary must be greater than 0')
  .min(yup.ref('minsalary'), 'Max Salary must be greater than Min Salary'),
  joblocation: yup.string().required('Job Location is required'),
  emptype: yup.string().required('Employment Type is required'),
  skills: yup.string().required('Skills are required'),
  description: yup.string().required('Description is required'),
  companylogo: yup.mixed().nullable().required('Image is required')
});

function NewJob() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [companylogo, setCompanylogo] = useState<File | null>(null)
  const [showImage, setShowImage] = useState(window.innerWidth >= 1500);
  const userId = useSelector((store: RootState) => store.recruiter.UserId)
  console.log("DA",userId);
  
  const handleLogout = () => {
    dispatch(recruiterLogout());
    localStorage.removeItem('recruiterToken');
    navigate('/recruiter/recLogin');
  };
  

  const handleHome = () => {
    navigate('/recruiter/recHome');
  };
  const handleNewJob = () => {
    navigate('/recruiter/newjob');
  };
  const handleProfile = () => {
    if (userId) {
      navigate(`/recruiter/profile/${userId}`);
    }
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
      console.log("SD0",jobData);
      Array.from(jobData.entries()).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });
   
      try {
        const response = await axiosRecruiterInstance.post('/recruiter/createjob', jobData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.status === 200) {
          console.log('Job created successfully');
          navigate('/recruiter/recHome');
        }
      } catch (error) {
        console.error('Error creating job:', error);
      }
    }
  });
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setCompanylogo(file); 
    formik.setFieldValue('companylogo', file); 
  }
  return (
    <Box sx={{ backgroundColor: 'beige' }}>
      <AppBar position="static" sx={{ height: '85px', backgroundColor: 'white', marginBottom: '10px' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <img
              src="../../../Images/logo.png"
              alt="Logo"
              className="w-16 h-auto absolute"
              style={{ top: '10px', left: '50px' }}
            />
          </Typography>
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
                <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleProfile}>
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
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box
          sx={{ backgroundColor: 'white', boxShadow: 8, borderRadius: 4, p: 8, width: 'full', maxWidth: '95vw' }}
          className="flex flex-col md:flex-row items-center relative"
        >
          <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Create New Job
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              <Box mb={2} sx={{ width: '450px' }}>
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
                  fullWidth
                  labelId="emptype-label"
                  name="emptype"
                  required
                  value={formik.values.emptype}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.emptype && Boolean(formik.errors.emptype)}
                >
                  <MenuItem value="Full-Time">Full-Time</MenuItem>
                  <MenuItem value="Part-Time">Part-Time</MenuItem>
                  <MenuItem value="Part-Time">Remote</MenuItem>
                  <MenuItem value="Internship">Internship</MenuItem>
                </Select>
                {formik.touched.emptype && formik.errors.emptype && (
                  <Typography color="error" variant="caption">
                    {formik.errors.emptype}
                  </Typography>
                )}
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Skills"
                  name="skills"
                  placeholder="Comma separated"
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
                  multiline
                  rows={4}
                  required
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Box>
              <Box mb={2}>
              <Button 
  variant="contained" 
  component="label" 
  htmlFor="companylogo"
  style={{
    backgroundImage: 'linear-gradient(45deg, #4a47a3 30%, #7067cf 90%)',
    color: 'white',
    borderRadius: '20px',
    padding: '10px 20px',
  }}
>
  Upload Image
  <input
    type="file"
    hidden
    id="companylogo"
    name="companylogo"
    onChange={handleImageChange}
  />
</Button>

  {formik.values.companylogo && (
    <Typography variant="body2" component="p" mt={1}>
      {formik.values.companylogo.name}
    </Typography>
  )}
  {formik.values.companylogo && (
    <img
      src={URL.createObjectURL(formik.values.companylogo)}
      alt="Uploaded Image"
      style={{ maxWidth: '10%', height: 'auto', marginTop: '10px' }}
    />
  )}
  {formik.touched.companylogo && formik.errors.companylogo && (
    <Typography color="error" variant="caption">
      {formik.errors.companylogo}
    </Typography>
  )}
</Box>

<Button 
  variant="contained" 
  type="submit"
  style={{
    backgroundImage: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    color: 'white', 
    borderRadius: '20px', 
    padding: '10px 20px', 
  }}
>
  Create Job
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
                  zIndex: '0'
                }}
              />
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default NewJob;
