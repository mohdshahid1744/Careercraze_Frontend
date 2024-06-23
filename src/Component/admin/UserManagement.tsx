import React, { useState, useEffect } from 'react';
import { axiosAdminInstance } from '../../utils/axios/Axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import { userLogout } from '../../Redux/Slice/userSlice';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { adminLogout } from '../../Redux/Slice/adminSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Redux/Store/Store';

type User = {
  name: string;
  isActive: boolean;
  email: string;
  mobile: number;
};

function UserManagement() {
  const [Users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOpen = (user: User) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };
  const handleLogout = () => {
    dispatch(adminLogout());
    localStorage.removeItem('adminToken');
    navigate('/');
  };
  const handleToggleActive = async () => {
    if (!selectedUser) return;
    try {
      const response = await axiosAdminInstance.put(`/user/${selectedUser.email}`);
      if (response.data && response.data.users) {
        if (selectedUser.email === loggedInUserEmail) {
          dispatch(userLogout());
          localStorage.removeItem('userToken');
          
        }
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
    } finally {
      handleClose();
    }
  };
  const loggedInUserEmail = useSelector((state: RootState) => state.user.userEmail);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosAdminInstance.get('/users');
        if (response.data && response.data.users) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, []);

  const menuItems = [
    { text: 'Dashboard', onClick: () => navigate('/admin/dashboard') },
    { text: 'User', onClick: () => navigate('/admin/user') },
    { text: 'Recruiter', onClick: () => navigate('/admin/recruiter') },
  ];

  return (
    <div className="flex min-h-screen bg-gray-200">
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
              User Management
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Box className="flex flex-col items-center justify-center p-4 flex-grow">
          <Box className="bg-white p-6 rounded-lg shadow-md text-center w-full max-w-7xl mt-4">
            <TableContainer component={Paper} sx={{ width: '100%' }}>
              <Table sx={{ minWidth: 650, width: '100%' }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="left">E-Mail</TableCell>
                    <TableCell align="left">Mobile</TableCell>
                    <TableCell align="left">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Users.map((user) => (
                    <TableRow
                      key={user.email}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {user.name}
                      </TableCell>
                      <TableCell align="left">{user.email}</TableCell>
                      <TableCell align="left">{user.mobile || 'Not Available'}</TableCell>
                      <TableCell align="left">
                        <Button
                          variant="contained"
                          color={user.isActive ? 'secondary' : 'primary'}
                          onClick={() => handleOpen(user)}
                        >
                          {user.isActive ? 'Block' : 'Unblock'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            borderRadius: 20,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {selectedUser?.isActive ? 'Block User' : 'Unblock User'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to {selectedUser?.isActive ? 'block' : 'unblock'} the user "{selectedUser?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleToggleActive} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UserManagement;
