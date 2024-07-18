import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import {
  Stack,
  TextField,
  InputLabel,
  FormControl,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';

import Label from 'src/components/label';

import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

function formatTime(date) {
  const years = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = '00';
  const milliseconds = '000';

  return `${years}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}

export default function ListVoucherRow({
  voucherId,
  code,
  discount,
  minOrderAmount,
  expiryDate,
  status,
  onDelete,
  onEdit,
  onShow,
}) {
  const [open, setOpen] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState({ discount: '', minOrderAmount: '', expiryDate: '' });

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
      await onDelete(voucherId);
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Failed to delete voucher:', error);
    }
  };

  const handleOpenEditDialog = () => {
    const formattedExpiryDate = expiryDate ? new Date(expiryDate).toISOString().slice(0, 16) : '';

    setEditData({
      discount,
      minOrderAmount,
      expiryDate: formattedExpiryDate,
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
    const formattedExpiryDate = editData.expiryDate ? formatTime(editData.expiryDate) : null;

    try {
      await onEdit(voucherId, { ...editData, expiryDate: formattedExpiryDate });
      handleCloseEditDialog();
    } catch (error) {
      console.error('Failed to edit voucher:', error);
    }
  };
  const handleShow = async () => {
    try {
      await onShow(voucherId);
    } catch (error) {
      console.error('Failed to show product:', error);
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell align="center">{voucherId}</TableCell>
        <TableCell align="center">{code}</TableCell>
        <TableCell align="center">{discount}</TableCell>
        <TableCell align="center">{minOrderAmount}</TableCell>
        <TableCell align="center">{expiryDate}</TableCell>
        <TableCell align="center">
          <Label color={status === true ? 'success' : 'error'}>
            {status === true ? 'Active' : 'Inactive'}
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

        <MenuItem onClick={handleShow}>
          <Iconify icon="bxs:show" width={22} sx={{ mr: 2 }} />
          Active
        </MenuItem>
        <MenuItem onClick={handleOpenDeleteDialog} sx={{ color: 'error.main' }}>
          <Iconify icon="bxs:hide" width={22} sx={{ mr: 2 }} />
          Hidden
        </MenuItem>
      </Popover>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Voucher</DialogTitle>
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
            Are you sure you want to delete this voucher?
          </Typography>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" color="error" onClick={handleDelete} sx={{ px: 5, mt: 2 }}>
              Delete
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="md">
        <DialogTitle>Update Voucher</DialogTitle>
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
          <Stack direction="row" spacing={2}>
            <FormControl sx={{ mt: 1, width: '50%' }} variant="outlined">
              <InputLabel htmlFor="outlined-discount">Discount</InputLabel>
              <OutlinedInput
                id="discount"
                label="Discount"
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                aria-describedby="discount"
                onChange={handleInputChange}
                value={editData.discount ? editData.discount : ''}
                name="discount"
              />
            </FormControl>
            <FormControl sx={{ mt: 1, width: '50%' }} variant="outlined">
              <InputLabel htmlFor="outlined-minOrderAmount">Min Order Amount</InputLabel>
              <OutlinedInput
                id="minOrderAmount"
                label="Min Order Amount"
                endAdornment={<InputAdornment position="end">$</InputAdornment>}
                aria-describedby="minOrderAmount"
                onChange={handleInputChange}
                value={editData.minOrderAmount ? editData.minOrderAmount : ''}
                name="minOrderAmount"
              />
            </FormControl>
          </Stack>
          <Stack sx={{ width: '100%', mt: 2 }}>
            <TextField
              variant="outlined"
              type="datetime-local"
              onChange={handleInputChange}
              name="expiryDate"
              value={editData.expiryDate || ''}
              fullWidth
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

ListVoucherRow.propTypes = {
  voucherId: PropTypes.number,
  code: PropTypes.string,
  discount: PropTypes.any,
  minOrderAmount: PropTypes.any,
  status: PropTypes.bool,
  expiryDate: PropTypes.any,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onShow: PropTypes.func,
};
