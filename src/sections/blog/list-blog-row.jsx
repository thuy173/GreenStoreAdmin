import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Typography } from '@mui/material';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import Label from 'src/components/label';
import CustomSnackbar from 'src/components/snackbar/snackbar';

import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

export default function ListBlogRow({
  blogId,
  title,
  description,
  thumbnail,
  createAt,
  approved,
  onApprove,
}) {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [alert, setAlert] = useState({ message: null, severity: 'success', isOpen: false });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const vietnamOffset = 7 * 60;
    const localOffset = date.getTimezoneOffset();
    const vietnamTime = new Date(date.getTime() + (vietnamOffset + localOffset) * 60000);

    const yearD = vietnamTime.getFullYear();
    const month = String(vietnamTime.getMonth() + 1).padStart(2, '0');
    const day = String(vietnamTime.getDate()).padStart(2, '0');
    const hours = String(vietnamTime.getHours()).padStart(2, '0');
    const minutes = String(vietnamTime.getMinutes()).padStart(2, '0');
    const seconds = String(vietnamTime.getSeconds()).padStart(2, '0');

    return `${day}-${month}-${yearD} | ${hours}:${minutes}:${seconds}`;
  };

  const handleCloseAlert = () => {
    setAlert({ message: null, severity: 'success', isOpen: false });
  };

  const showAlert = (severity, message) => {
    setAlert({ severity, message, isOpen: true });
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleOpenEdit = (id) => {
    navigate(`/blog/update/${id}`);
  };


  const handleCloseApproveDialog = () => {
    setOpenApproveDialog(false);
  };

  const handleOpenApproveDialog = () => {
    setOpenApproveDialog(true);
  };

  const handleApprove = async () => {
    try {
      await onApprove(blogId);
      handleCloseApproveDialog();
    } catch (error) {
      console.error('Failed to approve blog:', error);
    }
  };

  useEffect(() => {
    const add = localStorage.getItem('addPost') === 'true';
    const update = localStorage.getItem('updatePost') === 'true';

    if (add) {
      showAlert('success', 'Created post successfully!');
      localStorage.removeItem('addPost');
    }
    if (update) {
      showAlert('success', 'Update post successfully!');
      localStorage.removeItem('updatePost');
    }
  }, []);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox">
        <TableCell align="center">{blogId}</TableCell>
        <TableCell align="center">
          <img src={thumbnail} alt={thumbnail} style={{ width: '100px', objectFit: 'cover' }} />
        </TableCell>
        <TableCell align="center">{title}</TableCell>
        <TableCell align="center">{description}</TableCell>
        <TableCell align="center">{formatDate(createAt)}</TableCell>

        <TableCell align="center">
          <Label
            color={approved === true ? 'success' : 'error'}
            onClick={approved === false ? handleOpenApproveDialog : undefined}
          >
            {approved === true ? 'Approved' : 'Unapproved'}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            handleOpenEdit(blogId);
          }}
        >
          <Iconify icon="dashicons:update-alt" width={22} sx={{ mr: 2 }} />
          Update
        </MenuItem>
      </Popover>

      <Dialog open={openApproveDialog} onClose={handleCloseApproveDialog}>
        <DialogTitle>Approve post</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseApproveDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Are you sure you want to approve this post?
          </Typography>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" color="error" onClick={handleApprove} sx={{ px: 5, mt: 2 }}>
              Approve
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <CustomSnackbar
        open={alert.isOpen}
        onClose={handleCloseAlert}
        message={alert.message}
        severity={alert.severity}
      />
    </>
  );
}

ListBlogRow.propTypes = {
  blogId: PropTypes.any,
  title: PropTypes.any,
  description: PropTypes.any,
  thumbnail: PropTypes.any,
  createAt: PropTypes.any,
  approved: PropTypes.any,
  onApprove: PropTypes.func,
};
