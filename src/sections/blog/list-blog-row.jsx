import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import { Stack, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import Label from 'src/components/label';

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
}) {
  const [open, setOpen] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState({ categoryName: '', description: '' });

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
      console.error('Failed to edit category:', error);
    }
  };
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
          <Label color={approved === true ? 'success' : 'error'}>
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
};
