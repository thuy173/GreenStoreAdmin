import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

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

import Label from '../../components/label';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

export default function ListProductRow({
  productId,
  productName,
  price,
  description,
  unitOfMeasure,
  productImages,
  status,
  selected,
  onHide,
  onShow,
}) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(null);
  const [openHideDialog, setOpenHideDialog] = useState(false);

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
      await onHide(productId);
      handleCloseHideDialog();
    } catch (error) {
      console.error('Failed to hide product:', error);
    }
  };
  const handleShow = async () => {
    try {
      await onShow(productId);
    } catch (error) {
      console.error('Failed to show product:', error);
    }
  };

  const handleEditProduct = () => {
    navigate(`/product/edit/${productId}`);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell> */}

        <TableCell align="center">{productId}</TableCell>

        <TableCell align="center">
          <img
            src={productImages[0].imageUrl}
            alt={productName}
            style={{ width: '100px', objectFit: 'cover' }}
          />
        </TableCell>
        <TableCell align="center">{productName}</TableCell>

        <TableCell align="center">{price}</TableCell>

        <TableCell align="center">1 {unitOfMeasure}</TableCell>

        <TableCell align="center">
          <Label color={status === 1 ? 'success' : 'error'}>
            {status === 1 ? 'Active' : 'Inactive'}
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
        <MenuItem onClick={handleEditProduct}>
          <Iconify icon="dashicons:update-alt" width={22} sx={{ mr: 2 }} />
          Update
        </MenuItem>

        <MenuItem onClick={handleShow}>
          <Iconify icon="bxs:show" width={22} sx={{ mr: 2 }} />
          Show
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
    </>
  );
}

ListProductRow.propTypes = {
  productId: PropTypes.any,
  productName: PropTypes.any,
  description: PropTypes.any,
  price: PropTypes.any,
  unitOfMeasure: PropTypes.any,
  productImages: PropTypes.any,
  status: PropTypes.number,
  selected: PropTypes.any,
  onHide: PropTypes.func,
  onShow: PropTypes.func,
};
