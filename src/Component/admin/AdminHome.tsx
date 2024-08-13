import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData } from 'chart.js';
import { adminLogout } from '../../Redux/Slice/adminSlice';
import { axiosRecruiterInstance, axiosUserInstance } from '../../utils/axios/Axios';
import LogoutIcon from '@mui/icons-material/Logout';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface UserData {
  month: number;
  count: number;
}

interface RecruiterData {
  month: number;
  count: number;
}

interface PostData {
  month: number;
  count: number;
}

interface JobData {
  month: number;
  count: number;
}

interface UserRecruiterData {
  month: number;
  userCount: number;
  recruiterCount: number;
}

interface PostJobData {
  month: number;
  postCount: number;
  jobCount: number;
}

interface ChartState {
  userRecruiterData: UserRecruiterData[];
  postJobData: PostJobData[];
}

function AdminHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [recruiterCount, setRecruiterCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const [chartData, setChartData] = useState<ChartState | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [userResponse, recruiterResponse, postResponse, jobResponse] = await Promise.all([
          axiosUserInstance.get('/usercount'),
          axiosRecruiterInstance.get('/recruiter/count'),
          axiosUserInstance.get('/postchart'),  
          axiosRecruiterInstance.get('/recruiter/getjobchart'),
        ]);
        setUserCount(userResponse.data.count);
        setRecruiterCount(recruiterResponse.data.count);
        setPostCount(postResponse.data.response.count);
        setJobCount(jobResponse.data.response.count);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    const fetchChartData = async () => {
      try {
        const [userChartResponse, recruiterChartResponse, postChartResponse, jobChartResponse] = await Promise.all([
          axiosUserInstance.get('/getuserchart'),
          axiosRecruiterInstance.get('/recruiter/getreports'),
          axiosUserInstance.get('/postchart'),
          axiosRecruiterInstance.get('/recruiter/getjobchart'),
        ]);

        const userChartData = userChartResponse.data.response.result;
        const recruiterChartData = recruiterChartResponse.data.response.result;
        const postChartData = postChartResponse.data.response.result;
        const jobChartData = jobChartResponse.data.response.result;

        const combinedUserRecruiterData: UserRecruiterData[] = userChartData.map((userData: UserData) => {
          const recruiterData = recruiterChartData.find(
            (report: RecruiterData) => report.month === userData.month
          ) || { count: 0 };

          return {
            month: userData.month,
            userCount: userData.count,
            recruiterCount: recruiterData.count,
          };
        });

        const combinedPostJobData: PostJobData[] = postChartData.map((postData: PostData) => {
          const jobData = jobChartData.find(
            (job: JobData) => job.month === postData.month
          ) || { count: 0 };

          return {
            month: postData.month,
            postCount: postData.count,
            jobCount: jobData.count,
          };
        });

        setChartData({
          userRecruiterData: combinedUserRecruiterData,
          postJobData: combinedPostJobData,
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchCounts();
    fetchChartData();
  }, []);

  const handleLogout = () => {
    dispatch(adminLogout());
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const menuItems = [
    { text: 'Dashboard', onClick: () => navigate('/admin/dashboard') },
    { text: 'User', onClick: () => navigate('/admin/user') },
    { text: 'Recruiter', onClick: () => navigate('/admin/recruiter') },
    { text: 'Skill', onClick: () => navigate('/admin/skill') },
    { text: 'Post', onClick: () => navigate('/admin/post') },
  ];

  const getUserRecruiterChartConfig = (): ChartData<'line'> => {
    if (!chartData) return { labels: [], datasets: [] };

    const labels = chartData.userRecruiterData.map(data => `Month ${data.month}`);
    const userCounts = chartData.userRecruiterData.map(data => data.userCount);
    const recruiterCounts = chartData.userRecruiterData.map(data => data.recruiterCount);

    return {
      labels,
      datasets: [
        {
          label: 'Users',
          data: userCounts,
          borderColor: 'blue',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
        },
        {
          label: 'Recruiters',
          data: recruiterCounts,
          borderColor: 'green',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
      ],
    };
  };

  const getPostJobChartConfig = (): ChartData<'line'> => {
    if (!chartData) return { labels: [], datasets: [] };

    const labels = chartData.postJobData.map(data => `Month ${data.month}`);
    const postCounts = chartData.postJobData.map(data => data.postCount);
    const jobCounts = chartData.postJobData.map(data => data.jobCount);

    return {
      labels,
      datasets: [
        {
          label: 'Posts',
          data: postCounts,
          borderColor: 'orange',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          fill: true,
        },
        {
          label: 'Jobs',
          data: jobCounts,
          borderColor: 'purple',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          fill: true,
        },
      ],
    };
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'beige' }}>
      <Drawer
        variant="permanent"
        className="w-60"
        classes={{ paper: 'w-60 box-border' }}
      >
        <Toolbar />
        <div className="overflow-auto">
          <List>
            {menuItems.map((item, index) => (
              <ListItem key={index} onClick={item.onClick}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
      <div className="flex flex-col flex-grow">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className="flex-grow">
              Admin Dashboard
            </Typography>
            <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Box className="flex flex-col items-center justify-center p-4">
        <div className="flex flex-wrap w-full max-w-lg mt-4" style={{ justifyContent: 'space-between' }}>
  <Box className="bg-blue-100 p-8 rounded-md shadow-md text-center" style={{ flexBasis: '48%', marginBottom: '10px' }}>
    <Typography variant="h6" component="h2" gutterBottom>
      Users
    </Typography>
    <Typography variant="h4">{userCount}</Typography>
  </Box>
  <Box className="bg-green-100 p-8 rounded-md shadow-md text-center" style={{ flexBasis: '48%', marginBottom: '10px' }}>
    <Typography variant="h6" component="h2" gutterBottom>
      Recruiters
    </Typography>
    <Typography variant="h4">{recruiterCount}</Typography>
  </Box>
  <Box className="bg-red-100 p-8 rounded-md shadow-md text-center" style={{ flexBasis: '48%', marginBottom: '10px' }}>
    <Typography variant="h6" component="h2" gutterBottom>
      Posts
    </Typography>
    <Typography variant="h4">{postCount}</Typography>
  </Box>
  <Box className="bg-yellow-100 p-8 rounded-md shadow-md text-center" style={{ flexBasis: '48%', marginBottom: '10px' }}>
    <Typography variant="h6" component="h2" gutterBottom>
      Jobs
    </Typography>
    <Typography variant="h4">{jobCount}</Typography>
  </Box>
</div>


          <Box className="mt-8 w-full max-w-4xl">
            <Typography variant="h6" gutterBottom>
              Users and Recruiters
            </Typography>
            <Line data={getUserRecruiterChartConfig()} />
          </Box>

          <Box className="mt-8 w-full max-w-4xl">
            <Typography variant="h6" gutterBottom>
              Posts and Jobs
            </Typography>
            <Line data={getPostJobChartConfig()} />
          </Box>
        </Box>
      </div>
    </div>
  );
}

export default AdminHome;
