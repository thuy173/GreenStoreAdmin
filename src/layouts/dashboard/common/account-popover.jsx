import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { logOut } from 'src/redux/actions/authActions';
import { getLocalStorage, clearLocalStorage } from 'src/services/agent';

export default function AccountPopover() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(null);
  const [userId, setUserId] = useState('');
  const [roleUser, setRoleUser] = useState('');

  useEffect(() => {
    const storedUserId = getLocalStorage('uD');
    setUserId(storedUserId);
    const storeRole = getLocalStorage('rE');
    setRoleUser(storeRole);
  }, []);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    clearLocalStorage();
    dispatch(logOut(navigate));
  };

  const handleProfileClick = () => {
    handleClose();
    navigate(`/teacherProfile/${userId}`);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src=""
          alt=""
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          T
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            T
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            T
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {roleUser !== 'Admin' && <MenuItem onClick={handleProfileClick}>Profile</MenuItem>}

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />
        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogout}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
