import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography, Button, Box, IconButton, Card, CardContent, CardMedia, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { adminLogout } from '../../Redux/Slice/adminSlice';
import { useDispatch } from 'react-redux';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import { axiosUserInstance } from '../../utils/axios/Axios';

function PostManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [posts, setPosts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

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

  const handleDelete = async () => {
    try {
      if (selectedPostId) {
        await axiosUserInstance.post(`/delete`, { postId: selectedPostId });
        setPosts(posts.filter(post => post._id !== selectedPostId));
        setSelectedPostId(null);
        setOpen(false);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleOpenDialog = (postId: string) => {
    setSelectedPostId(postId);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedPostId(null);
    setOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosUserInstance.get('/getAllPost');
        console.log("ADMIN", response);
        if (Array.isArray(response.data.posts)) {
            const sortedPosts = response.data.posts.sort((a:any, b:any) => b.reported.length - a.reported.length);
            setPosts(sortedPosts);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen " style={{backgroundColor:'beige'}}>
      <Drawer
        variant="permanent"
        className="w-60"
        classes={{ paper: 'w-60 box-border' }}
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
        <AppBar position="static" className="bg-gray-800 w-full">
          <Toolbar>
            <Typography variant="h6" className="flex-grow">
              Post Management
            </Typography>
            <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Box p={3} className="flex-grow bg-gray-100">
          {posts.length === 0 ? (
            <Typography variant="h6" className="text-center">
              No Post Is Reported
            </Typography>
          ) : (
            posts.map((post, index) => (
              <Card key={index} className="w-3/4 mx-auto my-4 shadow-md rounded-lg">
                <CardContent className="flex flex-col sm:flex-row items-center">
               
                  <Box className="flex-grow">
                    <Typography variant="h6" className="font-semibold">
                      User ID: {post.userId}
                    </Typography>
                    <Typography variant="body1" className="font-semibold">
                      Post ID: {post._id}
                    </Typography>
                    <Typography variant="body1" className="font-semibold">
                      No of Reports: {post.reported.length}
                    </Typography>
                  </Box>
                  <CardMedia
                    component="img"
                    alt="Post Image"
                    height="140"
                    image={post.image}
                    className="w-32 h-40 object-cover rounded-lg"
                  />
                  <IconButton
                    color="secondary"
                    onClick={() => handleOpenDialog(post._id)}
                    className="ml-4"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
        <Dialog
          open={open}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="secondary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default PostManagement;
