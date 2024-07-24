import { useState } from 'react';
import PropTypes from 'prop-types';

import { Select } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { formatDateVietNam } from 'src/utils/format-time';

import OrderServices from 'src/services/OrderServices';

import CustomSnackbar from 'src/components/snackbar/snackbar';

import Iconify from '../../components/iconify';
import DetailDialogView from './view/detail-view';

// ----------------------------------------------------------------------

export default function ListOrderRow({
  orderId,
  orderCode,
  customerId,
  fullName,
  email,
  phoneNumber,
  orderDate,
  totalAmount,
  shippingAddress,
  status,
  onLoad,
}) {
  const [open, setOpen] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [alert, setAlert] = useState({ message: null, severity: 'success', isOpen: false });

  const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED', 'RETURNED'];

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleOpenDetailDialog = () => {
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
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
      <TableRow hover tabIndex={-1} onClick={handleOpenDetailDialog}>
        <TableCell align="center">{orderCode}</TableCell>

        <TableCell align="center">{fullName}</TableCell>

        <TableCell align="center">{phoneNumber}</TableCell>

        <TableCell align="center">{shippingAddress}</TableCell>

        <TableCell align="center">{totalAmount}</TableCell>

        <TableCell align="center">{formatDateVietNam(orderDate)}</TableCell>

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
        <MenuItem onClick={handleOpenDetailDialog}>
          <Iconify icon="bxs:detail" width={22} sx={{ mr: 2 }} />
          Detail
        </MenuItem>
      </Popover>

      <Dialog open={openDetailDialog} onClose={handleCloseDetailDialog} fullWidth maxWidth="lg">
        <DialogTitle>Detail Order</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseDetailDialog}
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
          <DetailDialogView orderId={orderId} />
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
  orderId: PropTypes.number,
  orderCode: PropTypes.any,
  customerId: PropTypes.number,
  fullName: PropTypes.string,
  email: PropTypes.string,
  phoneNumber: PropTypes.string,
  orderDate: PropTypes.any,
  totalAmount: PropTypes.any,
  shippingAddress: PropTypes.string,
  status: PropTypes.any,
  onLoad: PropTypes.any,
};
