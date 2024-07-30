import React, { useState, useEffect } from 'react';
import { axiosAdminInstance } from '../../utils/axios/Axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
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
import { Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography, TablePagination, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { adminLogout } from '../../Redux/Slice/adminSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Redux/Store/Store';
import LogoutIcon from '@mui/icons-material/Logout';

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
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
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
    } finally {
      handleClose();
    }
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
    { text: 'Skill', onClick: () => navigate('/admin/skill') },
    { text: 'Post', onClick: () => navigate('/admin/post') },
  ];

  const filteredUsers = Users.filter((user) => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Drawer variant="permanent" className="w-60" classes={{ paper: 'w-60 box-border' }}>
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
            <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Box className="flex flex-col items-center justify-center p-4 flex-grow">
          <Box className="bg-white p-6 rounded-lg shadow-md text-center w-full max-w-7xl mt-4">
            <TextField
              label="Search by email"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />
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
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                    <TableRow key={user.email} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        {user.name}
                      </TableCell>
                      <TableCell align="left">{user.email}</TableCell>
                      <TableCell align="left">{user.mobile || 'Not Available'}</TableCell>
                      <TableCell align="left">
                        <Button variant="contained" color={user.isActive ? 'secondary' : 'primary'} onClick={() => handleOpen(user)}>
                          {user.isActive ? 'Block' : 'Unblock'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[3, 5, 10]}
                component="div"
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
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

