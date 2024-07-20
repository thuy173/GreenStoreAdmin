import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import { Select } from '@mui/material';
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

import OrderServices from 'src/services/OrderServices';

import CustomSnackbar from 'src/components/snackbar/snackbar';

import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

export default function ListOrderRow({
  orderId,
  customerId,
  fullName,
  email,
  phoneNumber,
  orderDate,
  totalAmount,
  shippingAddress,
  status,
  onLoad,
  onHide,
}) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(null);
  const [openHideDialog, setOpenHideDialog] = useState(false);
  const [alert, setAlert] = useState({ message: null, severity: 'success', isOpen: false });

  const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED', 'RETURNED'];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const vietnamOffset = 7 * 60 * 60000;
    const vietnamTime = new Date(date.getTime() + vietnamOffset);

    const yearD = vietnamTime.getFullYear();
    const month = String(vietnamTime.getMonth() + 1).padStart(2, '0');
    const day = String(vietnamTime.getDate()).padStart(2, '0');
    const hours = String(vietnamTime.getHours()).padStart(2, '0');
    const minutes = String(vietnamTime.getMinutes()).padStart(2, '0');
    const seconds = String(vietnamTime.getSeconds()).padStart(2, '0');

    return `${day}-${month}-${yearD} | ${hours}:${minutes}:${seconds}`;
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleOpenHideDialog = () => {
    setOpenHideDialog(true);
  };

  const handleCloseHideDialog = () => {
    setOpenHideDialog(false);
  };

  const handleHide = async () => {
    try {
      await onHide(orderId);
      handleCloseHideDialog();
    } catch (error) {
      console.error('Failed to hide product:', error);
    }
  };

  const handleDetailOrder = () => {
    navigate(`/order/detail/${orderId}`);
  };

  const showAlert = (severity, message) => {
    setAlert({ severity, message, isOpen: true });
  };

  const handleCloseAlert = () => {
    setAlert({ message: null, severity: 'success', isOpen: false });
  };

  const handleChangeStatus = async (event) => {
    const newStatus = event.target.value;
    try {
      const response = await OrderServices.changeStatus(orderId, newStatus);

      if (response && response.status === 200) {
        showAlert('success', 'Update status order successfully!');
        onLoad();
      } else {
        setAlert({
          message: response?.response?.data?.message || 'An error occurred. Please check again!',
          severity: 'error',
          isOpen: true,
        });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      setAlert({
        message: error.message || 'An error occurred.',
        severity: 'error',
        isOpen: true,
      });
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell align="center">{orderId}</TableCell>

        <TableCell align="center">{fullName}</TableCell>

        <TableCell align="center">{phoneNumber}</TableCell>

        <TableCell align="center">{shippingAddress}</TableCell>

        <TableCell align="center">{totalAmount}</TableCell>

        <TableCell align="center">{formatDate(orderDate)}</TableCell>

        <TableCell align="center">
          <Select
            value={status}
            onChange={handleChangeStatus}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            sx={{ height: 30 }}
          >
            {statuses.map((items) => (
              <MenuItem key={items} value={items}>
                {items}
              </MenuItem>
            ))}
          </Select>
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
        <MenuItem onClick={handleDetailOrder}>
          <Iconify icon="dashicons:update-alt" width={22} sx={{ mr: 2 }} />
          Detail
        </MenuItem>

        <MenuItem onClick={handleOpenHideDialog} sx={{ color: 'error.main' }}>
          <Iconify icon="bxs:hide" width={22} sx={{ mr: 2 }} />
          Hidden
        </MenuItem>
      </Popover>

      <Dialog open={openHideDialog} onClose={handleCloseHideDialog}>
        <DialogTitle>Hide product</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseHideDialog}
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
            Are you sure you want to hide this product?
          </Typography>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" color="error" onClick={handleHide} sx={{ px: 5, mt: 2 }}>
              Hide
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

ListOrderRow.propTypes = {
  orderId: PropTypes.any,
  customerId: PropTypes.any,
  fullName: PropTypes.any,
  email: PropTypes.any,
  phoneNumber: PropTypes.any,
  orderDate: PropTypes.any,
  totalAmount: PropTypes.any,
  shippingAddress: PropTypes.any,
  status: PropTypes.any,
  onLoad: PropTypes.any,
  onHide: PropTypes.func,
};
