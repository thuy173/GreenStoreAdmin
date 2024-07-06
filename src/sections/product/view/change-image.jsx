import PropTypes from 'prop-types';
import React, { useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import {
  Card,
  Stack,
  Button,
  Dialog,
  Backdrop,
  IconButton,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import ProductServices from 'src/services/ProductServices';

import DropZone from 'src/components/drop-zone';
import CustomSnackbar from 'src/components/snackbar/snackbar';

const ChangeImageProduct = ({ productId, index, onLoadData, onClose, open }) => {
  const [alert, setAlert] = useState({ message: null, severity: 'success', isOpen: false });
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCloseAlert = () => {
    setAlert({ message: null, severity: 'success', isOpen: false });
  };

  const handleDropzoneClose = () => {
    setImage(null);
  };

  const handleChangeImage = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', image);

      const response = await ProductServices.changeImage(productId, index, formData);
      if (response && response.status === 200) {
        localStorage.setItem('changeImageProduct', 'true');
        onLoadData();
        onClose();
      } else {
        setAlert({
          message: response?.response?.data?.message || 'An error occurred. Please check again!',
          severity: 'error',
          isOpen: true,
        });
      }
    } catch (error) {
      console.error('Failed to change image:', error);
      setAlert({
        message: error.message || 'An error occurred.',
        severity: 'error',
        isOpen: true,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
      <DialogTitle>Change Image Product</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
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
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
          <Card
            style={{
              width: '300px',
              height: '200px',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f8f9fa',
            }}
          >
            <DropZone
              onDrop={setImage}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              onDropzoneClose={handleDropzoneClose}
            />
          </Card>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleChangeImage} variant="contained" color="success">
          Update
        </Button>
      </DialogActions>
      <CustomSnackbar
        open={alert.isOpen}
        onClose={handleCloseAlert}
        message={alert.message}
        severity={alert.severity}
      />
      <Backdrop open={loading} style={{ color: '#fff', zIndex: 1400 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
};

ChangeImageProduct.propTypes = {
  productId: PropTypes.func,
  index: PropTypes.func,
  onLoadData: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.func,
};

export default ChangeImageProduct;
