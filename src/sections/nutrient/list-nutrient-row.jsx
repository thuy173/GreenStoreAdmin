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
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

export default function ListNutrientRow({
  nutrientId,
  nutrientName,
  description,
  selected,
  onDelete,
  onEdit,
}) {
  const [open, setOpen] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState({ nutrientName: '', description: '' });

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = async () => {
    try {
      await onDelete(nutrientId);
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Failed to delete nutrient:', error);
    }
  };

  const handleOpenEditDialog = () => {
    setEditData({
      nutrientName,
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
      await onEdit(nutrientId, editData);
      handleCloseEditDialog();
    } catch (error) {
      console.error('Failed to edit nutrient:', error);
    }
  };
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell align="center">{nutrientId}</TableCell>
        <TableCell align="center">{nutrientName}</TableCell>
        <TableCell align="center">{description}</TableCell>

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

        <MenuItem onClick={handleOpenDeleteDialog} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" width={22} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Nutrient</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseDeleteDialog}
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
            Are you sure you want to delete this nutrient?
          </Typography>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" color="error" onClick={handleDelete} sx={{ px: 5, mt: 2 }}>
              Delete
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="md">
        <DialogTitle>Update nutrient</DialogTitle>
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
              label="Nutrient name"
              style={{ borderRadius: '2%', marginTop: '10px' }}
              variant="outlined"
              onChange={handleInputChange}
              value={editData.nutrientName ? editData.nutrientName : ''}
              name="nutrientName"
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

ListNutrientRow.propTypes = {
  nutrientId: PropTypes.any,
  nutrientName: PropTypes.any,
  description: PropTypes.any,
  selected: PropTypes.any,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};
