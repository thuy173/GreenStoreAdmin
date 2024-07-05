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
  handleClick,
  onDelete,
}) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = async () => {
    try {
      await onDelete(productId);
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Failed to delete book:', error);
    }
  };

  const handleEditNews = () => {
    navigate(`/book/editBook/${productId}`);
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
          <Label color={status === 1 ? 'success' : 'error'}>{status ? 'Active' : 'Inactive'}</Label>
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
        <MenuItem onClick={handleEditNews}>
          <Iconify icon="eva:edit-fill" width={22} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleOpenDeleteDialog} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" width={22} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Xóa sách</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn xóa quyển sách này?
          </Typography>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="outlined" color="warning" onClick={handleCloseDeleteDialog}>
              Đóng
            </Button>
            <Button variant="contained" color="error" onClick={handleDelete} sx={{ ml: 1 }}>
              Xóa sách
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
  status: PropTypes.bool,
  handleClick: PropTypes.func,
  selected: PropTypes.any,
  onDelete: PropTypes.func,
};
