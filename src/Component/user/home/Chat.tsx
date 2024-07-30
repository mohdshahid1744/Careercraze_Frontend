import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Button,
  Avatar,
  TextField,
  CircularProgress,
  Dialog, DialogActions, DialogContent, DialogTitle, Menu,
  MenuItem,
  useMediaQuery
} from '@mui/material';
import { FormControl } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import Lottie from 'react-lottie';
import { styled } from '@mui/system';
import socket from '../../../utils/Socket/Soket';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Redux/Store/Store';
import { userLogout } from '../../../Redux/Slice/userSlice';
import { axiosUserInstance } from '../../../utils/axios/Axios';
import animationData from './Animation/typing.json';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { useWebRTC } from '../../../Context/WebrtcContext';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationBadge from "react-notification-badge";
import { Theme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import { format, formatDistanceToNow, differenceInDays, differenceInMonths } from 'date-fns';

interface User {
  _id: string;
  name: string;
  avatar: string;
  lastSeen:string
}

interface Chat {
  _id: string;
  participants: string[];
}

interface Message {
  _id: string;
  sender: string;
  message: string;
  filePath: string;
  fileType: string;
  createdAt: string;
}
interface StatusTextProps {
  isOnline: boolean;
}
interface ChatProps {
  messages: Message[];
}

const ChatBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: theme?.palette?.background?.default || '#f0f0f0',
}));

const Sidebar = styled(Paper)(({ theme }) => ({
  width: '25%',
  padding: theme?.spacing(2),
  boxSizing: 'border-box',
  backgroundColor: theme?.palette?.grey?.[200] || '#e0e0e0',
}));

const ChatArea = styled(Paper)(({ theme }) => ({
  flexGrow: 1,
  padding: theme?.spacing(2),
  boxSizing: 'border-box',
  marginLeft: theme?.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 85px)',
  overflow: 'hidden',
}));
const formatTimestamp = (timestamp:any) => {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isThisYear = date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (isThisYear) {
    return date.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' }) + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }) + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
};

const StatusText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isOnline',
})<StatusTextProps>(({ isOnline }) => ({
  color: isOnline ? 'green' : 'red',
  fontSize: '0.875rem', 
}));

const fadeInAnimation = `
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

const ChatHeader = styled(Typography)`
  background-color: #ffffff; /* White background */
  color: #333333; /* Dark gray text color */
  padding: 15px 30px; /* Adjusted padding */
  font-size: 1.6rem; /* Slightly smaller font size */
  font-weight: bold; /* Bold font weight */
  text-align: center; /* Center align text */
  border-radius: 8px; /* Slightly rounded corners */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow effect */
`;
const MessagesBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme?.spacing(1),
  marginBottom: theme?.spacing(2),
  backgroundColor: theme?.palette?.background?.paper || '#fff',
  borderRadius: theme?.spacing(1),
}));


var selectedChatCompare:any 

const Chat = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [chatList, setChatList] = useState<Chat[]>([]);
  const [participants, setParticipants] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  console.log("Ithaaaaaaaaaaadddddddddddddaaaaaaaaaaa",messages);
  
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const userId = useSelector((state: RootState) => state.user.UserId);
  const [selectedChat, setSelectedChat] = useState<any>();
  const [notification, setNotification] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing,setTyping]=useState(false)
  const [istyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
const [messageToDelete, setMessageToDelete] = useState<string>('');
const { startCall, acceptCall, endCall, localStream, remoteStream, inCall } = useWebRTC();
const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
const [menuOpen, setMenuOpen] = useState(false); 
const ringtoneRef = useRef<HTMLAudioElement | null>(null);
const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
const [isEditing, setIsEditing] = useState(false);
const [editedMessage, setEditedMessage] = useState<Message[]>([]);
const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
const [editedText, setEditedText] = useState<string>("");
const [dialogOpen, setDialogOpen] = useState<boolean>(false);
const [optionsVisible, setOptionsVisible] = useState<string | null>(null);
const [selectedFile, setSelectedFile] = useState<File | null>(null);
console.log("Selected file",selectedFile);

const [selectedFileType, setSelectedFileType] = useState<string | null>(null);
const [showFileOption, setShowFileOption] = useState(false);
const isMenuOpen = Boolean(showFileOption);
const isImage = (type:string) => type.startsWith('image/');
const isVideo = (type:string) => type.startsWith('video/');
const handleFileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
  setShowFileOption(true);
};


const textFieldRef = useRef<HTMLInputElement>(null);
const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendMessage(event);
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }
};


const handleFileOptionClick = (fileType: string) => {
  
  const fileInput = document.getElementById('file-input') as HTMLInputElement;
  console.log("ASDSDAAAAAAAAA",fileInput);
  
  fileInput.accept = fileType === 'image' ? 'image/*' : fileType === 'video' ? 'video/*' : '*/*';
  fileInput.onchange = () => handleFileChange(fileInput.files, fileType);
  fileInput.click();
  setShowFileOption(false);
};
const formatLastSeen = (lastSeen: string | null) => {
  if (!lastSeen) return "Never";

  const lastSeenDate = new Date(lastSeen);
  const now = new Date();
  const daysDifference = differenceInDays(now, lastSeenDate);
  const monthsDifference = differenceInMonths(now, lastSeenDate);

  if (monthsDifference >= 1) {
    return format(lastSeenDate, "dd-MM-yyyy");
  } else if (daysDifference >= 1) {
    return formatDistanceToNow(lastSeenDate, { addSuffix: true });
  } else {
    return format(lastSeenDate, "p");
  }
};

const handleDoubleClick = (messageId: string) => {
  
  setOptionsVisible(messageId === optionsVisible ? null : messageId);
};

const playRingtone = () => {
  if (ringtoneRef.current) {
    ringtoneRef.current.play().catch((error) => {
      console.error("Error playing ringtone:", error);
    });
  }
};

const stopRingtone = () => {
  if (ringtoneRef.current) {
    ringtoneRef.current.pause();
    ringtoneRef.current.currentTime = 0;
  }
};
useEffect(() => {
  socket.on('incomingCall', () => {
    playRingtone();
  });

  socket.on('callAccepted', () => {
    stopRingtone();
  });

  socket.on('callEnded', () => {
    stopRingtone();
  });

  return () => {
    socket.off('incoming call');
    socket.off('call accepted');
    socket.off('call declined');
  };
}, []);
useEffect(() => {
  socket.on('user status', (users: string[]) => {
    setOnlineUsers(users);
  });

  return () => {
    socket.off('user status');
  };
}, []);
const isOnline = (userId: string) => {
  return onlineUsers.includes(userId);
};
const handleMenuOpen = () => {
  setMenuOpen(true);
};

const handleMenuClose = () => {
  setMenuOpen(false);
};
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const handleEmojiSelect = (emoji: any) => {
    const updatedMessage = newMessage + emoji.native;
    setNewMessage(updatedMessage);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  useEffect(() => {
    fetchChatList();
  }, []);

  useEffect(() => {
    if (selectedChat?._id) {
      fetchMessages();
    }
    
  }, [selectedChat?._id]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        setLoading(true);

        const { data } = await axiosUserInstance.get(
            `/getmessage/${selectedChat._id}`,
            config
        );

        console.log("Fetched messages:", data.messages);

        setMessages(data.messages || []);
        setLoading(false);

        socket.emit("join chat", selectedChat._id);
    } catch (error) {
        console.error('Failed to fetch messages:', error);
        setLoading(false);
    }
};

console.log("NOTIFICATION",notification);

useEffect(() => {
  selectedChatCompare = selectedChat;
  
  const handleMessageReceived = async (newMessageReceived: any) => {
    console.log("Message received:", newMessageReceived);
    const messageExists = notification.some(notify => notify._id === newMessageReceived._id);
    
      if (selectedChatCompare && newMessageReceived.chat === selectedChatCompare._id) {
        const senderName = await fetchUserDetails(newMessageReceived.sender);
        setMessages([...messages, newMessageReceived]);
        setNotification([...notification, { ...newMessageReceived, senderName }]);
      } else {
        const senderName = await fetchUserDetails(newMessageReceived.sender);
        if (!selectedChatCompare) {
          
          setNotification([...notification, { ...newMessageReceived, senderName }]);
        }
      }
    
  };

  socket.on('message received', handleMessageReceived);

  return () => {
    socket.off('message received', handleMessageReceived);
  };
}, [notification, selectedChat, messages]);



  const handleDeleteConfirmation = (messageId: string) => {
    setMessageToDelete(messageId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false);
    setMessageToDelete('');
  };
  const handleEditClick = (message: Message) => {
    console.log("MEsssssssssssssssaghfsha",message);
    
    setEditingMessageId(message._id);
    setEditedText(message.message);
    setDialogOpen(true);
  };
  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedText(event.target.value);
  };
  const handleEditCancel = () => {
    setDialogOpen(false);
    setEditedText("");
  };
  const handleEditSave = async () => {
    if (editingMessageId) {
      try {
        const chatId = selectedChat?._id;
        await axiosUserInstance.put('/editmessage', {
          messageId: editingMessageId,
          newMessage: editedText,
        });
        socket.emit("edit message", { messageId: editingMessageId, newMessage: editedText, chatId });
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === editingMessageId ? { ...msg, message: editedText } : msg
          )
        );
        setDialogOpen(false);
        setEditedText("");
      } catch (error) {
        console.error('Failed to edit message', error);
      }
    }
  };
  useEffect(() => {
    socket.on('message deleted', (messageId: any) => {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
    });
    return () => {
      socket.off('message deleted');
    };
  }, []);
  useEffect(() => {
    socket.on('message edited', (editedMessage) => {
      console.log("Received edited message:", editedMessage);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === editedMessage.messageId
            ? { ...msg, message: editedMessage.newMessage }
            : msg
        )
      );
    });

    return () => {
      socket.off('message edited');
    };
  }, []);

  useEffect(() => {
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
    return () => {
      socket.off('connect');
    };
  }, [user]);

  const fetchChatList = async () => {
    try {
      const { data } = await axiosUserInstance.get(`/getchat/${user.UserId}`);
      const chatList = data.chatlist || [];
      setChatList(chatList);
      const participantIds = chatList.flatMap((chat: any) => chat.participants);
      fetchParticipantDetails(participantIds);
    } catch (error) {
      console.error('Failed to fetch chat list:', error);
    }
  };
const fetchUserDetails=async(userId:string)=>{
  try {
    const response = await axiosUserInstance.get(`/getuser/${userId}`);
    return response.data.response.name;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return 'Unknown User';
  }
}
  const fetchParticipantDetails = async (participantIds: string[]) => {
    try {
      const { data } = await axiosUserInstance.get('/users');
      setParticipants(data.users);
    } catch (error) {
      console.error('Failed to fetch participant details:', error);
    }
  };
  const getParticipantLastSeen = (userId: string) => {
    const participant = participants.find(p => p._id === userId);
    return participant ? participant.lastSeen : null;
  };
  


  const handleDeleteMessage = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const chatId = selectedChat?._id;
      await axiosUserInstance.delete(`/deletechat/${messageToDelete}`);
      setMessages((prevMessages) => prevMessages.filter(msg => msg._id !== messageToDelete));
      socket.emit("delete message", messageToDelete, chatId);
      setDeleteConfirmationOpen(false);
      setMessageToDelete('');
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const handleEditMessage = async (message: Message) => {
    try {
      const chatId = selectedChat?._id;
      await axiosUserInstance.put('editmessage', {
       

      });
    } catch (error) {
      console.error('Failed to edit message', error);
    }
  };
  

  const handleChatSelect = (chat: Chat) => {
    console.log("CHaaaaaaaaaaaaaaaaaaaaaaaaaat",chat);
    
    if (!chat ) {
      console.error("Invalid chat object or chat ID");
      return;
    }
  
    setSelectedChat(chat);
  
    if (socket && socket.emit) {
      socket.emit('join chat', chat._id);
    } else {
      console.error("Socket is not defined or emit function is not available");
    }
  };
  

  const handleLogout = () => {
    dispatch(userLogout());
    localStorage.removeItem('userToken');
    navigate('/');
  };

  const typingHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat?._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat?._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const sendMessage = async (event: React.KeyboardEvent<HTMLInputElement> | null) => {
    if ((event === null || event.key === "Enter") && (newMessage.trim() !== "" || selectedFile)) {
      if (event) event.preventDefault();
      socket.emit("stop typing", selectedChat?._id);
  
      const chatId = selectedChat?._id || '';
      const userIdValue = userId || '';
  
      if (!chatId || !userIdValue) {
        console.error("Chat ID or User ID is missing");
        return;
      }
  
      try {
        const formData = new FormData();
        formData.append('chatId', chatId);
        formData.append('userId', userIdValue);
        formData.append('message', newMessage);
  
        if (selectedFile) {
          formData.append('file', selectedFile);
        }
  
        const config = {
          headers: {
            "Content-type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        };
  
        const response = await axiosUserInstance.post("/chat", formData, config);
  
        // Check if the response contains the filePath
        if (response.data.filePath) {
          console.log("File Path in Response:", response.data.filePath);
        }
  
        socket.emit("new message", response.data);
        setMessages((prevMessages) => [...prevMessages, response.data]);
        setNewMessage("");
        setSelectedFile(null);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };
  
  
  const handleSendClick = () => {
    sendMessage(null);
  };
  useEffect(() => {
    socket.on('message received', (newMessage) => {
      console.log("Message received:", newMessage);
      
      if (!messages.some(msg => msg._id === newMessage._id)) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
  });
  
    return () => {
        socket.off('message received');
    };
}, [socket]);

  
  


  
  const handleFileChange = (files: FileList | null, fileType: string) => {
    if (files && files.length > 0) {
        setSelectedFile(files[0]);
        setSelectedFileType(fileType);
    }
};


  const getParticipantDetails = (participantId: string) => {
    const loggedInUserId = user.UserId;
    if (!Array.isArray(participants)) {
      console.error("Participants list is undefined or not an array");
      return null;
    }
  
    const participant = participants.find(participant => participant._id === participantId);
  
    if (!participant) return null;
  
    if (participant._id === loggedInUserId) {
      
      if (!selectedChat || Array.isArray(selectedChat.participants==false)) {
        console.error("Selected chat or its participants list is undefined or not an array");
        return null;
      }
      const otherParticipantId = selectedChat.participants?.find((id: any) => id !== loggedInUserId);
      
      return participants.find(participant => participant._id === otherParticipantId);
    } else {
      return participant;
    }
  };
  

  const handleCloseEmojiPicker = () => {
    setShowEmojiPicker(false);
  };
 
  return (
    <ChatBox>
       <audio ref={ringtoneRef} src="/ringtone.mp3" />

      <Box sx={{ display: 'flex', flexGrow: 1, mt: '5px' }}>
        <Sidebar elevation={3}>
       
        <ChatHeader variant="h6" gutterBottom style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',fontSize: isSmallScreen ? '0.8rem' : '1.25rem' }}>
      Chats
      <IconButton
          color="inherit"
          onClick={handleMenuOpen}
          style={{ fontSize: isSmallScreen ? '1rem' : '2rem' }}
        >
          <NotificationsIcon fontSize={isSmallScreen ? 'small' : 'inherit'} />
          <NotificationBadge count={notification.length} />
        </IconButton>
      <Menu
        anchorEl={null} 
        open={menuOpen} 
        onClose={handleMenuClose} 
      >
        <MenuItem>
       
          {!notification.length && "No new messages"}
          {notification.map((notify, index) => (
          <MenuItem key={index} >
            {notify.senderName}: {notify.message}
          </MenuItem>
        ))}
        </MenuItem>
      </Menu>
    </ChatHeader>
    
      <List sx={{ width: '100%', maxWidth: 360 }}>
        {chatList && chatList.length > 0 ? (
          chatList.map((chat) => {
            let participantId =
              chat.participants[0] !== user.UserId
                ? chat.participants[0]
                : chat.participants[1];
            const participantDetails = getParticipantDetails(participantId);

            return (
              <ListItem
                key={chat._id}
                onClick={() => handleChatSelect(chat)}
                selected={selectedChat?._id === chat._id}
                sx={{
                  borderRadius: '10px',
                  backgroundColor: selectedChat?._id === chat._id ? '#f0f0f0' : '#ffffff',
                  '&:hover': { backgroundColor: '#f0f0f0' },
                  marginBottom: '10px',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                  transition: 'background-color 0.2s ease',
                }}
              >
       <Box position="relative">
        <Avatar
          alt={participantDetails?.name}
          src={participantDetails?.avatar}
          sx={{
            width: { xs: 40, sm: 48, md: 64 }, 
            height: { xs: 40, sm: 48, md: 64 }, 
            marginRight: 2
          }}
        />
        {!isSmallScreen && (
          <Box
            position="absolute"
            bottom={0}
            right={0}
            width={16}
            height={16}
            borderRadius="50%"
            bgcolor={isOnline(participantId) ? 'green' : 'red'}
            sx={{ border: '2px solid white' }} 
          />
        )}
      </Box>
      {!isSmallScreen ? (
        <ListItemText
          primary={participantDetails?.name || 'Loading...'}
          primaryTypographyProps={{
            variant: 'subtitle1',
            fontWeight: 'bold',
            color: '#333333',
            sx: {
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.25rem' }, 
            }
          }}
          secondary={
            <Typography variant="caption" color={isOnline(participantId) ? 'green' : 'red'}>
              {isOnline(participantId) ? 'Online' : 'Offline'}
            </Typography>
          }
        />
      ) : (
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            bgcolor: isOnline(participantId) ? 'green' : 'red',
            position: 'absolute',
            bottom: 0,
            right: 0,
            transform: 'translate(50%, 50%)'
          }}
        />
      )}
              </ListItem>
            );
          })
        ) : (
          <Box sx={{ padding: '16px', textAlign: 'center', color: '#888888' }}>
            <Typography>No chats available</Typography>
          </Box>
        )}
      </List>
        </Sidebar>
        <ChatArea elevation={3}>
  <>
    {selectedChat ? (
      
      <>
        <Typography
          component="span"
          fontSize={{ base: '28px', md: '30px' }}
          paddingBottom={3}
          paddingX={2}
          width="100%"
          fontFamily="Work sans"
          display="flex"
          justifyContent={{ base: 'space-between' }}
          alignItems="center"
        >
          <IconButton
            sx={{
              display: { base: 'flex' },
            }}
            onClick={() => setSelectedChat(null)}
          >
            <ArrowBackIcon />
          </IconButton>
          {messages.length > 0 && (
            <Avatar
              alt={getParticipantDetails(messages[0].sender)?.name}
              src={getParticipantDetails(messages[0].sender)?.avatar}
              sx={{ mr: 2 }}
            />
          )}
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <div style={{fontSize:'1rem'}}>

  {
    getParticipantDetails(
      selectedChat.participants?.find(
        (id: any) => id !== user.UserId
      ) || ''
    )?.name
  }
            </div>
  <div >
    
  <StatusText isOnline={isOnline(getParticipantDetails(selectedChat.participants?.find(
    (id: any) => id !== user.UserId
  ) || '')?._id || '')} style={{fontSize:'0.75rem'}}>
    {isOnline(getParticipantDetails(selectedChat.participants?.find(
      (id: any) => id !== user.UserId
    ) || '')?._id || '') ? 'Online' : `Last seen: ${formatLastSeen(getParticipantLastSeen(selectedChat.participants?.find(
      (id: any) => id !== user.UserId
    ) || ''))}`}
  </StatusText>
  </div>
  <IconButton
    sx={{ color: 'primary.main' }}
    onClick={() => {
      const currentUser = user.UserId;
      const participantToCall = selectedChat?.participants.find((p:any) => p !== currentUser);
      if (participantToCall) {
        startCall(participantToCall);
      } else {
        console.error("No participants available to call");
      }
    }}
  >
    <VideoCallIcon />
  </IconButton>
</Typography>
        </Typography>
        <MessagesBox style={{ backgroundColor: 'beige' }}>
          {loading ? (
            <CircularProgress />
          ) : (
            messages.map((message, index) => {
              const isOwnMessage = message.sender === user.UserId;
              const showOptions = optionsVisible === message._id;

              return (
                <div
                  key={message._id}
                  onDoubleClick={() => handleDoubleClick(message._id)}
                  style={{
                    alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
                    padding: '10px 14px',
                    borderRadius: '20px',
                    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
                    backgroundColor: isOwnMessage ? '#DCF8C6' : '#FFFFFF',
                    marginBottom: '10px',
                    maxWidth: '60%',
                    marginLeft: isOwnMessage ? 'auto' : 'inherit',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                >
                  {isEditing && editingMessageId === message._id ?(
                    <>
                <TextField
                value={editedText}
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                size="small"
              />
              <Button  color="primary" size="small">Save</Button>
              <Button  color="secondary" size="small">Cancel</Button>
                    </>
                  ):(
                    <>
                       <Typography variant="body1" style={{ color: isOwnMessage ? '#000000' : '#888888', fontSize: '0.9375rem', lineHeight: 1.5 }}>
                {message.message}
                {message.filePath && (
                    <>
                        {message.fileType.startsWith('image/') && (
                            <img
                                src={message.filePath}
                                alt="Uploaded"
                                style={{ maxWidth: '40%', height: 'auto' }}
                            />
                        )}
                        {message.fileType.startsWith('video/') && (
                            <video
                                src={message.filePath}
                                controls
                                style={{ maxWidth: '100%', height: 'auto' }}
                            >
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </>
                )}
            </Typography>
                  {isOwnMessage &&showOptions&& (
            <>
              <IconButton
                size="small"
                onClick={() => handleEditClick(message)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '30px',
                  color: 'black',
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeleteConfirmation(message._id)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '5px',
                  color: 'red',
                }}
              >
               <DeleteIcon/>
              </IconButton>
            </>
          )}
                    </>
                  )}
                
                  <Typography
                    variant="caption"
                    style={{ marginTop: '4px', display: 'block', color: '#888888', fontSize: '0.75rem' }}
                  >
                    {formatTimestamp(message.createdAt)}
                  </Typography>
                </div>
              );
            })
          )}
        </MessagesBox>
        <Dialog open={dialogOpen} onClose={handleEditCancel}>
        <DialogTitle>Edit Message</DialogTitle>
        <DialogContent>
          <TextField
            value={editedText}
            onChange={handleEditChange}
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
        <FormControl>
          <div>
            <style>{fadeInAnimation}</style>
            {istyping && (
              <div>
                <Lottie
                  options={defaultOptions}
                  width={70}
                  style={{ marginBottom: 15, marginLeft: 0 }}
                />
              </div>
            )}
          </div>
          <TextField
            variant="filled"
            placeholder="Enter a message.."
            value={newMessage}
            onChange={typingHandler}
            onKeyDown={handleKeyDown}
            required
            InputProps={{
              endAdornment: (
                <>
                  <IconButton onClick={toggleEmojiPicker}>
                    <EmojiEmotionsIcon />
                  </IconButton>
                  {showEmojiPicker && (
                    <Picker
                      data={data}
                      onEmojiSelect={handleEmojiSelect}
                      style={{ position: 'absolute', bottom: '60px', right: '10px' }}
                    />
                  )}
                   <IconButton onClick={handleFileMenuOpen}>
                  <ImageIcon />
                </IconButton>
                {showFileOption && (
                <div className='absolute bottom-12 right-2 bg-white border border-gray-300 rounded shadow-lg'>
                  <button type='button' onClick={() => handleFileOptionClick('image')} className='block w-full text-left px-4 py-2 hover:bg-gray-100'>
                    Image
                  </button>
                  <button type='button' onClick={() => handleFileOptionClick('video')} className='block w-full text-left px-4 py-2 hover:bg-gray-100'>
                    Video
                  </button>
                </div>
              )}
              {selectedFile && (
               <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
               <Typography variant="body1" style={{ marginRight: 8 }}>
                 {selectedFile.name}
               </Typography>
               <Button variant="contained" color="primary" onClick={handleSendClick}>
                 Send
               </Button>
             </div>
              )}
            </>
          ),
        }}
      />
       <input type='file' className='hidden' id='file-input' />
    </FormControl>
      </>
    ) : (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Typography
          variant="h3"
          paddingBottom={3}
          fontFamily="Work Sans"
        >
          Click on a user to start chatting
        </Typography>
      </Box>
    )}
  </>
</ChatArea>

      </Box>
      <Dialog
      open={deleteConfirmationOpen}
      onClose={handleDeleteCancel}
      aria-labelledby="delete-message-dialog-title"
      fullWidth
    >
      <DialogTitle id="delete-message-dialog-title">Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to delete this message?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleDeleteMessage} color="primary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
    </ChatBox>
  );
};

export default Chat;

