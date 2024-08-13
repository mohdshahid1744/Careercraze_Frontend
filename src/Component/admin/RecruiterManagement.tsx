import React, { useState, useEffect } from 'react';
import {
    axiosAdminInstance,
    axiosRecruiterInstance,
} from '../../utils/axios/Axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    AppBar,
    Toolbar,
    Typography,
    TextField,
    TablePagination,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminLogout } from '../../Redux/Slice/adminSlice';
import LogoutIcon from '@mui/icons-material/Logout';

type User = {
    name: string;
    isActive: boolean;
    status: 'pending' | 'verified' | 'rejected';
    email: string;
    mobile: number;
    companyName: string;
    companyEmail: string;
};

function RecruiterManagement() {
    const [Users, setUsers] = useState<User[]>([]);
    const [open, setOpen] = useState(false);
    const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
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

    const handleVerifyOpen = (user: User) => {
        setSelectedUser(user);
        setVerifyDialogOpen(true);
    };

    const handleVerifyClose = () => {
        setVerifyDialogOpen(false);
        setSelectedUser(null);
    };

    const handleRejectOpen = (user: User) => {
        setSelectedUser(user);
        setRejectionReason('');
        setRejectDialogOpen(true);
    };

    const handleRejectClose = () => {
        setRejectDialogOpen(false);
        setSelectedUser(null);
    };

    const handleToggleActive = async () => {
        if (!selectedUser) return;
        try {
            const response = await axiosAdminInstance.put(
                `/recruiter/update/${selectedUser.email}`
            );
            if (response.data && response.data.users) {
                setUsers(response.data.users);
            }
        } catch (error) {
            console.error('Error toggling user status:', error);
        } finally {
            handleClose();
        }
    };

    const handleToggleStatus = async (
        newStatus: 'verified' | 'rejected',
        reason: string = ''
    ) => {
        if (!selectedUser) return;
        try {
            const response = await axiosRecruiterInstance.put(
                `/recruiter/verify/${selectedUser.email}`,
                { status: newStatus, reason }
            );
            if (response.data && response.data.users) {
                setUsers(response.data.users);
            }
        } catch (error) {
            console.error('Error toggling user status:', error);
        } finally {
            newStatus === 'verified' ? handleVerifyClose() : handleRejectClose();
        }
    };

    const handleLogout = () => {
        dispatch(adminLogout());
        localStorage.removeItem('adminToken');
        navigate('/');
    };

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosAdminInstance.get('/recruiter/all');
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
                            Recruiter Management
                        </Typography>
                        <Button
                            color="inherit"
                            onClick={handleLogout}
                            startIcon={<LogoutIcon />}
                        >
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>
                <Box className="flex flex-col items-center justify-center p-4 flex-grow">
                    <Box className="bg-white p-6 rounded-lg shadow-md text-center w-full max-w-7xl mt-4">
                    <TextField
                        label="Search by email or name"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-4"
                        />
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="left">E-Mail</TableCell>
                                        <TableCell align="left">Mobile</TableCell>
                                        <TableCell align="left">Company Name</TableCell>
                                        <TableCell align="left">Company E-Mail</TableCell>
                                        {/* <TableCell align="left">Active</TableCell> */}
                                        <TableCell align="left">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredUsers.slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    ).map(user => (
                                        <TableRow
                                            key={user.email}
                                            sx={{
                                                '&:last-child td, &:last-child th': {
                                                    border: 0,
                                                },
                                            }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {user.name}
                                            </TableCell>
                                            <TableCell align="left">
                                                {user.email}
                                            </TableCell>
                                            <TableCell align="left">{user.mobile || 'Not Available'}</TableCell>
                                            <TableCell align="left">
                                                {user.companyName || 'Not Available'}
                                            </TableCell>
                                            <TableCell align="left">
                                                {user.companyEmail || 'Not Available'}
                                            </TableCell>
                                            {/* <TableCell align="left">
                                                <Button
                                                    variant="contained"
                                                    color={
                                                        user.isActive
                                                            ? 'secondary'
                                                            : 'primary'
                                                    }
                                                    onClick={() => handleOpen(user)}
                                                >
                                                    {user.isActive
                                                        ? 'Block'
                                                        : 'Unblock'}
                                                </Button>
                                            </TableCell> */}
                                            <TableCell align="left">
                                                {user.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() =>
                                                                handleVerifyOpen(user)
                                                            }
                                                            disabled={
                                                                user.status !== 'pending'
                                                            }
                                                        >
                                                            Verify
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() =>
                                                                handleRejectOpen(user)
                                                            }
                                                            disabled={
                                                                user.status !== 'pending'
                                                            }
                                                            style={{
                                                                marginLeft: '10px',
                                                            }}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                                {user.status === 'verified' && (
                                                    <Typography
                                                        variant="body1"
                                                        style={{ color: 'green' }}
                                                    >
                                                        Verified
                                                    </Typography>
                                                )}
                                                {user.status === 'rejected' && (
                                                    <Typography
                                                        variant="body1"
                                                        style={{ color: 'red' }}
                                                    >
                                                        Rejected
                                                    </Typography>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[3, 5, 10]}
                            component="div"
                            count={filteredUsers.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Box>
                </Box>
            </div>
            <Dialog
                open={rejectDialogOpen}
                onClose={handleRejectClose}
                aria-labelledby="reject-dialog-title"
                aria-describedby="reject-dialog-description"
                PaperProps={{
                    style: {
                        borderRadius: 20,
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                    },
                }}
            >
                <DialogTitle id="reject-dialog-title">Reject Recruiter</DialogTitle>
                <DialogContent>
                    <DialogContentText id="reject-dialog-description">
                        Are you sure you want to reject the recruiter "
                        {selectedUser?.name}"? Please provide a reason for rejection.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="rejectionReason"
                        label="Rejection Reason"
                        type="text"
                        fullWidth
                        value={rejectionReason}
                        onChange={e => setRejectionReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRejectClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() =>
                            handleToggleStatus('rejected', rejectionReason)
                        }
                        color="primary"
                        autoFocus
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={verifyDialogOpen}
                onClose={handleVerifyClose}
                aria-labelledby="verify-dialog-title"
                aria-describedby="verify-dialog-description"
                PaperProps={{
                    style: {
                        borderRadius: 20,
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                    },
                }}
            >
                <DialogTitle id="verify-dialog-title">Verify Recruiter</DialogTitle>
                <DialogContent>
                    <DialogContentText id="verify-dialog-description">
                        Are you sure you want to verify the recruiter "
                        {selectedUser?.name}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleVerifyClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => handleToggleStatus('verified')}
                        color="primary"
                        autoFocus
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default RecruiterManagement;
