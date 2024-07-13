import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Stack, TextField, Typography } from '@mui/material';

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
  onEdit,
  onApprove,
}) {
  const [open, setOpen] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [editData, setEditData] = useState({ categoryName: '', description: '' });

  const [alert, setAlert] = useState({ message: null, severity: 'success', isOpen: false });

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

  const handleOpenEditDialog = () => {
    setEditData({
      title,
      description,
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleInputChange = (e) => {
    const { name: inputName, value } = e.target;

    setEditData((prevData) => ({
      ...prevData,
      [inputName]: value,
    }));
  };

  const handleEdit = async () => {
    try {
      await onEdit(blogId, editData);
      handleCloseEditDialog();
    } catch (error) {
      console.error('Failed to edit blog:', error);
    }
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

    if (add) {
      showAlert('success', 'Created post successfully!');
      localStorage.removeItem('addPost');
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
        <TableCell align="center">{createAt}</TableCell>

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
        <MenuItem onClick={handleOpenEditDialog}>
          <Iconify icon="dashicons:update-alt" width={22} sx={{ mr: 2 }} />
          Update
        </MenuItem>
      </Popover>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="md">
        <DialogTitle>Update category</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseEditDialog}
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
          <Stack direction="column">
            <TextField
              id="outlined-basic"
              label="Category name"
              style={{ borderRadius: '2%', marginTop: '10px' }}
              variant="outlined"
              onChange={handleInputChange}
              value={editData.categoryName ? editData.categoryName : ''}
              name="categoryName"
            />
            <TextField
              id="outlined-basic"
              label="Description"
              style={{ borderRadius: '2%', marginTop: '20px' }}
              variant="outlined"
              onChange={handleInputChange}
              value={editData.description ? editData.description : ''}
              name="description"
            />
          </Stack>

          <Box display="flex" justifyContent="flex-end" sx={{ pt: 2 }}>
            <Button variant="contained" color="success" onClick={handleEdit} sx={{ px: 10 }}>
              Update
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
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
  onEdit: PropTypes.func,
  onApprove: PropTypes.func,
};
