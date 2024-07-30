import React, { useEffect, useState,useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, Container, Grid,
  TextField, Card, CardContent, IconButton, TextareaAutosize,
  Avatar, Modal, Backdrop,Paper,List,ListItem,ListItemAvatar,ListItemText,Menu,MenuItem,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  FormControl, InputLabel,Select,Divider
} from '@mui/material';
import { userLogout } from '../../../Redux/Slice/userSlice';
import { RootState } from '../../../Redux/Store/Store';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { axiosUserInstance } from '../../../utils/axios/Axios';
import CommentIcon from '@mui/icons-material/Comment';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { formatDistanceToNow } from 'date-fns';
import { debounce } from 'lodash';
import ConfirmationModal from './ConfimationModal';
import ReplyIcon from '@mui/icons-material/Reply';
import socket from '../../../utils/Socket/Soket';

interface Post {
  _id: string;
  description: string;
  image: string;
  createdAt: string;
  user: {
    name: string;
    title: string;
    avatar: string;
  };
  likes: {
    userId: string;
    createdAt: Date;
  }[];
  comments: {
    userId: string;
    message: string;
    username:string;
  }[];
}

interface Comment {
  _id: string;
  userId: string;
  message: string;
  username:string;
  createdAt: string;
  replies?: { message: string,username:string,createdAt: string; }[]; 
}



function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const userId = useSelector((state: RootState) => state.user.UserId);
  const [posts, setPosts] = useState<Post[]>([]);
  const [open, setOpen] = useState(false);
  const [newOpen,setNewOpen]=useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  const [expandedPosts, setExpandedPosts] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});;
  
const [commentVisibility, setCommentVisibility] = useState<{ [key: string]: boolean }>({});
const [searchText, setSearchText] = useState('');
const [searchResults, setSearchResults] = useState<any[]>([]);
const [searchRecruiterResults, setSearchRecruiterResults] = useState<any[]>([]);
const [searchOpen, setSearchOpen] = useState(false);
const [reportReason, setReportReason] = useState('');
const [openDialog, setOpenDialog] = useState(false);
const [reportingPostId, setReportingPostId] = useState('');
const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
const [deleteCommentInfo, setDeleteCommentInfo] = useState({ postId: '', commentId: '' });
const [commentOptions, setCommentoptions] = useState(false);
const [commentId, setCommentId] = useState('');
const [replyText, setReplyText] = useState('');
const [replyingTo, setReplyingTo] = useState(null);
const [expandedReplies, setExpandedReplies] = useState<{ [key: string]: boolean }>({}); 
const [commentCounts,setCommentCounts]=useState<number>(0)


const fetchPosts = async () => {
  try {
    const response = await axiosUserInstance.get(`/getAllPost`);
    const postsWithUsers = await Promise.all(response.data.posts.map(async (post:any) => {
      try {
        const userResponse = await axiosUserInstance.get(`/getuser/${post.userId}`);
        const userDetails = userResponse.data.response;
        return {
          ...post,
          user: {
            name: userDetails.name,
            title: userDetails.title,
            avatar: userDetails.avatar,
          },
        };
      } catch (userError) {
        console.error('Error fetching user details:', userError);
        return post;
      }
    }));
    console.log("POSR",postsWithUsers);
    
    setPosts(postsWithUsers);
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
};
console.log("POA",posts);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    } else {
      fetchPosts();
    }
  }, [isLoggedIn, navigate, userId]);
  const fetchComments = async (postId: string) => {
    try {
      const response = await axiosUserInstance.get(`/getcomment/${postId}`);
      const comments = response.data[0]?.comments || [];
  
      console.log("MESSAGE", comments);
  
      setComments((prev) => ({
        ...prev,
        [postId]: comments,
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };


 
  const handleCommentIconClick = async (postId: string) => {
    setCommentVisibility((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  
    if (!commentVisibility[postId]) {
      await fetchComments(postId);
    }
  };
  const handleReplyClick = (commentId:any) => {
    setReplyingTo(commentId);
  };
  const fetchUserProfile = async () => {
    try {
      const response = await axiosUserInstance.get(`/getuser/${userId}`);
      console.log("RESPONSE", response.data.response);

      setUserDetails(response.data.response);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const handleLogout = async() => {
    dispatch(userLogout());
    localStorage.removeItem('userToken');
    await axiosUserInstance.post('/logout',{userId})
    socket.emit('logout', userId);
    navigate('/');
  };

  const handleJob = () => {
    navigate('/job');
  };

  const handleProfile = () => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  const handleSavedJob = () => {
    navigate("/saved-jobs");
  };

  const handleOpen = (post: Post) => {
    setSelectedPost(post);
    setOpen(true);
  };
  const handleNewOpen=(post:Post)=>{
    setSelectedPost(post)
    setNewOpen(true)
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!description || !image) {
      alert("Description and image are required.");
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    formData.append('image', image);
    console.log("IMAGE",image);
    console.log("description",description);
console.log("FORMS",formData);

    try {
      const response = await axiosUserInstance.post(`/createpost/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("LKKLKL", response);

      const newPost = {
        ...response.data.post,
        user: {
          name: userDetails.name,
          title: userDetails.title,
          avatar: userDetails.avatar,
        },
      };
console.log("NEWWWW",newPost);

      setPosts([newPost, ...posts]);
      setDescription('');
      setImage(null);
    } catch (error) {
      console.error('Error uploading post:', error);
    }
  };
  const handleReportClick = (_id:string) => {
    console.log("_IDDSSA",_id);
    
    setReportingPostId(_id);
    setOpenDialog(true);
  };
const handleChat=()=>{
  navigate('/chat')
}
  const handleDialogClose = () => {
    setOpenDialog(false);
    setReportReason('');
  };

  const handleReportSubmit = async(_id:string,reason:string) => {
    console.log("POSTIDD",_id);
    
    const response=await axiosUserInstance.post('/report',{postId:_id,reason:reason,userId:userId})
    console.log("REASDSDASDA",response);
    
    console.log('Report submitted with reason:', reportReason);
    setOpenDialog(false);
    setReportReason('');
  };
  const toggleLike = async (postId: string) => {
    const post = posts.find((p) => p._id === postId);
    if (!post) return;

    const alreadyLiked = post.likes?.some((like) => like.userId === userId);

    try {
      if (alreadyLiked) {
        const response = await axiosUserInstance.post('/dislike', { userId, postId });
        console.log(response.data.message);

        const updatedPosts = posts.map((p) =>
          p._id === postId ? { ...p, likes: p.likes.filter((like) => like.userId !== userId) } : p
        );
        setPosts(updatedPosts);
      } else {
        const response = await axiosUserInstance.post('/like', { userId, postId });
        console.log(response.data.message);

        const updatedPosts = posts.map((p: any) =>
          p._id === postId ? { ...p, likes: [...p.likes, { userId, createdAt: new Date() }] } : p
        );
        setPosts(updatedPosts);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  const handleToggleReplies = (commentId:any) => {
    setExpandedReplies((prevState:any) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedPost(null);
  };
const handleNewClose=()=>{
  setNewOpen(false)
  setSelectedPost(null)
}
  const toggleExpand = (postId: string) => {
    setExpandedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const isExpanded = (postId: string) => expandedPosts.includes(postId);

  const truncateText = (text:string, maxLength:number) => {
    if (!text) {
      return '';
    }
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };
  

  const handleCommentChange = (postId: string, text: string) => {
    setCommentText((prev) => ({
      ...prev,
      [postId]: text,
    }));
    console.log("AASSSDA",commentText);
    
  };

  const handleCommentSubmit = async (postId: string) => {
    const text = commentText[postId];
    if (!text.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const userDataResponse = await axiosUserInstance.get(`/getuser/${userId}`); 
      const username = userDataResponse.data.response.name;
      console.log("SDFSDF",username);
      
      const response = await axiosUserInstance.post('/comment', { userId, postId, comment: text,username});
      console.log("SDGggggggggggggggggggggggggggg",response);
      if (response.data.message) {
        setPosts((prevPosts) =>
          prevPosts.map((post: any) =>
            post._id === postId ? { ...post, comments: [...post.comments, { userId, message: text }] } : post
          )
        );
        
        setCommentText((prev) => ({
          ...prev,
          [postId]: '',
        }));
        console.log("RAARAFTHA",commentText);
        
      }
      setCommentCounts((prevCount) => prevCount + 1);
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleReplyComment=async(parentCommentId:string)=>{
    try {
      const userDataResponse = await axiosUserInstance.get(`/getuser/${userId}`); 
      const username = userDataResponse.data.response.name;
      const response = await axiosUserInstance.post('/replycomment',{
      postId: selectedPost?._id,
      parentCommentId,
      comment: replyText,
      userId,
      username
    });
    if (response.status===200) {
      console.log('Reply added successfully');
      setReplyText('');
      setReplyingTo(null);
      
    } else {
      console.error('Failed to add reply');
    }
    
    } catch (error) {
      
    }
  }
  const fetchSearchedUsers = async (text: string) => {
    try {
      const response = await axiosUserInstance.get(`/searchuser?text=${encodeURIComponent(text)}`);
      console.log("Response from searchUser:", response.data);
      setSearchResults(response.data.users.users); 
      setSearchRecruiterResults(response.data.users.recruiters)
    } catch (error) {
      console.error('Error fetching searched users:', error);
    }
  };

  const debouncedFetchSearchedUsers = useCallback(
    debounce((text: string) => {
      fetchSearchedUsers(text); 
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchText(value);
    console.log("SAEARA",searchText);
    setSearchOpen(true);
    debouncedFetchSearchedUsers(value);
  };

  const handleSearchResultClick = (userId: string) => {
    navigate(`/profile/${userId}`);
    setSearchText(''); 
    setSearchResults([]); 
    setSearchRecruiterResults([])
    setSearchOpen(false); 
  };
  const handleSearchRecruiterResultClick = (userId: string) => {
    navigate(`/recProfile/${userId}`);
    setSearchText(''); 
    setSearchResults([]); 
    setSearchRecruiterResults([])
    setSearchOpen(false); 
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      setDeleteCommentInfo({ postId, commentId });
      setShowDeleteConfirmation(true);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  
  const showOptions = (postId: string, commentId: string) => {
    setCommentoptions(true);
    setCommentId(commentId);
  };
  const confirmDeleteComment = async () => {
    const { postId, commentId } = deleteCommentInfo;
    try {
      const response = await axiosUserInstance.delete('/deletecomment', {
        data: {
          postId: postId,
          commentId: commentId,
        },
      });
      console.log("Delete comment response:", response);
      setComments((prevComments) => {
        const updatedComments = { ...prevComments };
        updatedComments[postId] = updatedComments[postId].filter((comment) => comment._id !== commentId);
        return updatedComments;
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            const updatedComments = post.comments.filter(
              (comment: any) => comment._id !== commentId
            );
            return {
              ...post,
              comments: updatedComments,
            };
          }
          return post;
        })
      );
      setCommentoptions(false);
      setShowDeleteConfirmation(false);
      setCommentCounts((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  const reasons = [
    { value: 'scam', label: 'Scam' },
    { value: 'spam', label: 'Spam' },
    { value: 'hateSpeech', label: 'Hate Speech' },
    { value: 'violence', label: 'Violence' },
    { value: 'other', label: 'Other' }
  ];
  
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'beige' }}>
      <AppBar position="static" sx={{ height: '85px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <img
              src='../../../Images/logo.png'
              alt="Logo"
              className="w-16 h-auto absolute"
              style={{ top: '10px', left: '50px' }}
            />
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
              id="search"
              label="Search"
              value={searchText}
              onChange={handleSearchChange}
              sx={{
                width: '500px',
                backgroundColor: '#e3f2fd',
                borderRadius: "15px",
                border: "none",
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            {searchOpen && (
  <Paper sx={{ position: 'absolute', top: 55, left: 0, right: 0, maxHeight: '50vh', overflowY: 'auto', zIndex: 1200 }}>
    <List>
      {searchResults.map((user) => (
        <ListItem 
          key={user._id} 
          component="div" 
          onClick={() => handleSearchResultClick(user._id)} 
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}
        >
          <ListItemAvatar>
            <Avatar src={user.avatar} alt={user.name} />
          </ListItemAvatar>
          <ListItemText primary={user.name} secondary={user.title || 'User'} />
        </ListItem>
      ))}
      {searchRecruiterResults.map((recruiter) => (
        <ListItem 
          key={recruiter._id} 
          component="div" 
          onClick={() => handleSearchRecruiterResultClick(recruiter._id)} 
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}
        >
          <ListItemAvatar>
            <Avatar src={recruiter.avatar} alt={recruiter.name} />
          </ListItemAvatar>
          <ListItemText primary={recruiter.name} secondary={recruiter.title || 'Recruiter'} />
        </ListItem>
      ))}
    </List>
  </Paper>
)}

          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }} >
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }}>
                  <img src="../../../Images/Home.png" alt="Home Icon" style={{ width: '30px', height: '30px' }} />
                  <Typography variant="caption">Home</Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleJob}>
                  <img src="../../../Images/Job.png" alt="Job Icon" style={{ width: '30px', height: '30px' }} />
                  <Typography variant="caption">Job</Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleSavedJob}>
                  <img src="../../../Images/savejob.png" alt="Save Job Icon" style={{ width: '30px', height: '30px' }} />
                  <Typography variant="caption">Save Job</Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleChat}>
                  <img src="../../../Images/message.png" alt="Message Icon" style={{ width: '30px', height: '30px' }} />
                  <Typography variant="caption">Message</Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleProfile}>
                  <img src="../../../Images/Profile.png" alt="Profile Icon" style={{ width: '30px', height: '30px' }} />
                  <Typography variant="caption">Me</Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button sx={{ color: 'black', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }} onClick={handleLogout}>
                  <img src="../../../Images/logout.png" alt="Logout Icon" style={{ width: '30px', height: '30px' }} />
                  <Typography variant="caption">Logout</Typography>
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Toolbar>
      </AppBar>

      <Container className="flex justify-center lg:pl-72" style={{ marginTop: '20px' }}>
        <Box className="w-full lg:w-2/3 bg-white rounded-lg shadow-md p-4 lg:ml-auto lg:mr-4 text-left mt-4 lg:mt-0">
          <Typography variant="h6" className="mb-4">
            New Box Title
          </Typography>
          <div className="flex items-center mb-4">
            <Avatar className="w-10 h-10 mr-4"  alt={userDetails?.name} src={userDetails?.avatar} />
            <TextField
              id="description"
              label="Description"
              multiline
              rows={1}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              InputProps={{
                className: "h-12 rounded-lg",
              }}
            />
          </div>
          <input
            accept="image/*"
            id="icon-button-file"
            type="file"
            className="hidden"
            onChange={handleImageChange}
          />
          <label htmlFor="icon-button-file">
            <IconButton color="primary" aria-label="upload picture" component="span">
              <AddPhotoAlternateIcon />
            </IconButton>
          </label>
          <div className="flex items-center mt-4">
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              className="mr-2"
            >
              Upload
            </Button>
            {image && (
              <Typography variant="body1" className="ml-2">
                {image.name}
              </Typography>
            )}
          </div>
        </Box>
      </Container>

      <Container sx={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
        <Grid container spacing={3} sx={{ width: '80%' }}>
  <Grid item xs={12} lg={3} className="lg:visible hidden lg:block" style={{ marginTop: '20px' }}>
    <Box sx={{ width: '300px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', textAlign: 'left', marginTop: '-270px', marginLeft: '-140px' }}>
      <img
        alt={userDetails?.name}
        src={userDetails?.banner}
        style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'cover'}}
      />
      <Avatar sx={{ width: 60, height: 60, marginTop: '-30px' }} alt={userDetails?.name} src={userDetails?.avatar} />
      <Typography variant="h6" sx={{ marginBottom: '10px' }}>
        {userDetails?.name}
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: '5px' }}>
        Email: {userDetails?.email}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '0.75rem', marginBottom: '5px' }}>
        {userDetails?.title}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '0.75rem', marginBottom: '5px' }}>
      followers : {userDetails?.followers.length || 0}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: '0.75rem', marginBottom: '5px' }}>
      following : {userDetails?.following.length || 0}
      </Typography>
      <Box sx={{ borderBottom: '1px solid gray', margin: '10px 0' }} />
      {userDetails?.education?.map((edu: any) => (
        <Box key={edu._id} sx={{ marginBottom: '10px' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {edu.degree} in {edu.field}
          </Typography>
          <Typography variant="body2" sx={{ color: 'gray' }}>
            {edu.school}
          </Typography>
          <Typography variant="body2" sx={{ color: 'gray' }}>
            {new Date(edu.started).getFullYear()} - {edu.ended ? new Date(edu.ended).getFullYear() : 'Present'}
          </Typography>
        </Box>
      ))}
      {userDetails?.experience?.map((exp: any) => (
        <Box key={exp._id} sx={{ marginBottom: '10px' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {exp.role} in {exp.company}
          </Typography>
          <Typography variant="body2" sx={{ color: 'gray' }}>
            {new Date(exp.started).getFullYear()} - {exp.ended ? new Date(exp.ended).getFullYear() : 'Present'}
          </Typography>
        </Box>
      ))}
      
    </Box>
  </Grid>



          <Grid item xs={12} lg={9}>
            <Grid container direction="column" spacing={3}>
              {posts.map((post) => (
                <Grid item key={post._id}>
                  <Card sx={{
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#fff',
                    overflow: 'hidden',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'scale(1.02)' }
                  }}>
                    <CardContent sx={{ position: 'relative' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <Avatar sx={{ width: 32, height: 32, marginRight: '10px' }} src={post.user.avatar} alt={post.user.name} />
                  <Typography variant="subtitle1">{post.user.name}</Typography>
                  
                  <Box sx={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <Button onClick={() => handleReportClick(post._id)}>Report</Button>
                </Box>
                  <Dialog open={openDialog} onClose={handleDialogClose}>
                  <DialogTitle>Report Post</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Please select a reason for reporting this post.
                    </DialogContentText>
                    <FormControl fullWidth margin="dense">
                      <InputLabel>Reason</InputLabel>
                      <Select
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        label="Reason"
                      >
                        {reasons.map((reason) => (
                          <MenuItem key={reason.value} value={reason.value}>
                            {reason.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={() => handleReportSubmit(reportingPostId, reportReason)} color="primary" disabled={!reportReason}>
                      Submit
                    </Button>
                  </DialogActions>
                </Dialog>
                </Box> 
                      <Typography variant="caption" style={{ color: "gray" }}>{post.user.title}</Typography>

                      <Typography variant="body1" sx={{ marginBottom: '10px', display: 'block', whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: isExpanded(post._id) ? post.description : truncateText(post.description, 100) }} />

                      <img src={post.image} alt={post.description} style={{ width: '100%', borderRadius: '5px', marginBottom: '10px', cursor: 'pointer' }} onClick={() => handleOpen(post)} />
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', marginBottom: '10px' }}>
                        {new Date(post.createdAt).toLocaleString()}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <IconButton
                      aria-label="like"
                      onClick={() => toggleLike(post._id)}
                      sx={{ padding: '5px', color: '#3f51b5' }}
                    >
                      {post.likes?.some((like) => like.userId === userId) ? (
                        <ThumbUpAltIcon sx={{ fontSize: '24px', color: 'blue' }}  />
                      ) : (
                        <ThumbUpAltIcon  sx={{ fontSize: '24px', color: 'gray' }}/>
                      )}
                      <Typography variant="body2">{post.likes?.length || 0} Likes</Typography>
                    </IconButton>

                    <IconButton aria-label="comment" sx={{ padding: '5px', color: '#ff9800' }} onClick={() => handleCommentIconClick(post._id)}>
                    <CommentIcon onClick={() => handleNewOpen(post)} />

                          <Typography variant="body2">{commentCounts} </Typography>
                        </IconButton>
                      </Box>
                      <Box>
                      <TextareaAutosize
                          minRows={3}
                          placeholder="Add a comment..."
                          style={{ width: '100%', padding: '10px', borderRadius: '5px', borderColor: '#ccc', resize: 'none' }}
                          value={commentText[post._id] || ''}
                          onChange={(e) => handleCommentChange(post._id, e.target.value)}
                        />
                      <Button
                        variant="contained"
                        sx={{ marginTop: '10px', backgroundColor: '#3f51b5', color: '#fff' }}
                        onClick={() => handleCommentSubmit(post._id)}
                      >
                        Comment
                      </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        
      >
        <Card sx={{ maxWidth: 600, margin: 'auto', mt: 5, p: 2 }}>
          <CardContent>
            
            {selectedPost && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={selectedPost.user.avatar} sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{selectedPost.user.name}</Typography>
                    <Typography variant="body2">{selectedPost.user.title}</Typography>
                  </Box>
                </Box>
                <Typography variant="body1">{selectedPost.description}</Typography>
                {selectedPost.image && (
                  <img
                    src={selectedPost.image}
                    alt="Post"
                    style={{
                      marginTop: '10px',
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                    }}
                  />
                )}
                
              </>
            )}
          </CardContent>
        </Card>
      </Modal>
      <Modal
  open={newOpen}
  onClose={handleNewClose}
  closeAfterTransition
>
  <Card sx={{ maxWidth: 600, margin: 'auto', mt: 5, p: 2, boxShadow: 8, borderRadius: 4 }}>
    <CardContent sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
      {selectedPost && (
        <>
      
          <Typography variant="body1" sx={{ mb: 2, wordWrap: 'break-word', lineHeight: 1.6 }}>
            {selectedPost.description}
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', textAlign: 'center', mb: 2 }}>
          {selectedPost.image && (
                  <img
                    src={selectedPost.image}
                    alt="Post"
                    style={{
                      marginTop: '10px',
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                    }}
                  />
                )}
          </Typography>
        </>
      )}
{selectedPost &&
  comments[selectedPost._id]?.map((comment, index) => (
    <Box
      key={index}
      display="flex"
      flexDirection={index % 2 === 0 ? 'row-reverse' : 'row'}
      mb={2}
      alignItems="center"
    >
      <Box
        sx={{
          p: 1,
          backgroundColor: '#f0f0f0',
          borderRadius: 2,
          position: 'relative',
        }}
      >
       <Typography variant="body1" sx={{ mb: 1 }}>
        {comment?.username}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
        {comment.message}
      </Typography>

        <IconButton
          sx={{
            position: 'absolute',
            top: 13,
            right: 50,
            transform: 'translate(50%, -50%)',
          }}
          onClick={() => handleReplyClick(comment._id)}
        >
          <ReplyIcon />
        </IconButton>
        {comment.userId === userId &&(

        <Button
          sx={{
            position: 'absolute',
            top: 13,
            right: 15,
            transform: 'translate(50%, -50%)',
          }}
          onClick={() => showOptions(selectedPost._id, comment._id)}
        >
          ...
        </Button>
        )}

        <Typography variant="caption" color="textSecondary">
          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
        </Typography>

        {replyingTo === comment._id && (
          <div>
            <TextField
              multiline
              rows={2}
              variant="outlined"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{ mt: 1 }}
              onClick={() => handleReplyComment(comment._id)}
            >
              Reply
            </Button>
          </div>
        )}

        <Button
          variant="text"
          size="small"
          onClick={() => handleToggleReplies(comment._id)}
          sx={{ mt: 1 }}
        >
          {expandedReplies[comment._id] ? 'Hide Replies' : 'View Replies'}
        </Button>

        {expandedReplies[comment._id] && comment.replies && (
          <Box sx={{ pl: 4, pt: 2 }}>
            {comment.replies.map((reply, replyIndex) => (
              
              <Box key={replyIndex} mt={1}>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="body1" sx={{ mb: 1 }}>
                {reply?.username}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
                {reply.message}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
              </Typography>
            </Box>
            
            ))}
          </Box>
        )}

        {commentOptions && commentId === comment._id && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDeleteComment(selectedPost._id, comment._id)}
            sx={{ ml: 1 }}
          >
            Delete
          </Button>
        )}
      </Box>
    </Box>
  ))}

 <ConfirmationModal
        show={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={confirmDeleteComment}
        message={"Are You sure You need to delete Comment"} />
    </CardContent>
  </Card>
</Modal>
    </Box>
  );
}

export default Home;
