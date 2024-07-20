import PropTypes from 'prop-types';
import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css';

import {
  Box,
  Card,
  Grid,
  Stack,
  Paper,
  Avatar,
  Divider,
  Typography,
  CardContent,
} from '@mui/material';

import { formatDateVietNam } from 'src/utils/format-time';

import CustomSnackbar from 'src/components/snackbar/snackbar';

const InfoField = ({ label, value }) => (
  <Box display="flex" alignItems="center" mb={1}>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>
      {label}
    </Typography>
    <Typography variant="body2">{value}</Typography>
  </Box>
);

InfoField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

// ----------------------------------------------------------------------

export default function DetailOrder({ initialValues }) {
  const [alert, setAlert] = useState({ message: null, severity: 'success', isOpen: false });

  const handleCloseAlert = () => {
    setAlert({ message: null, severity: 'success', isOpen: false });
  };

  return (
    <Stack px={5} pb={3}>
      <Card>
        <CardContent>
          <Stack direction="row">
            {initialValues.orderDate && (
              <Typography variant="body2" mr={2} color="textSecondary">
                {formatDateVietNam(initialValues.orderDate)}
              </Typography>
            )}
            |{' '}
            <Typography variant="body2" ml={2}>
              Order Code: {initialValues.orderCode}
            </Typography>
          </Stack>

          <Divider />
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} sm={6}>
              <InfoField label="Fullname:" value={initialValues.fullName || 'GreenStore'} />
              <InfoField label="Phone Number:" value={initialValues.phoneNumber} />
              {initialValues.shippingAddress && (
                <InfoField label="Shipping Address:" value={initialValues.shippingAddress} />
              )}
            </Grid>
            <Divider orientation="vertical" flexItem />
            <Grid item xs={12} sm={5}>
              <InfoField label="Payment Method:" value={initialValues.paymentMethod} />
              <InfoField
                label="Voucher ID:"
                value={initialValues.voucherId ? initialValues.voucherId : 'None'}
              />
              <InfoField label="Total Amount:" value={initialValues.totalAmount} />
              <InfoField label="Status:" value={initialValues.status} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Stack>
        <Typography variant="h6" gutterBottom>
          Order Items
        </Typography>
        <Divider />
        <Grid container spacing={2} mt={2}>
          {initialValues.orderItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.orderItemId}>
              <Paper elevation={2} sx={{ padding: 2, display: 'flex', alignItems: 'center' }}>
                <Avatar
                  variant="rounded"
                  src={
                    item.productImages.length > 0
                      ? item.productImages[0].imageUrl
                      : '/placeholder.png'
                  }
                  alt={item.productName}
                  sx={{ width: 90, height: 'auto', mr: 2, objectFit: 'fit' }}
                />
                <Box>
                  <Typography variant="h6">{item.productName}</Typography>
                  <Typography variant="body2">{item.description}</Typography>
                  <Typography variant="body2">Quantity: {item.quantity}</Typography>
                  <Typography variant="body2">Price: ${item.price}</Typography>
                  <Typography variant="body2">Total Price: ${item.totalPrice}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Stack>

      <CustomSnackbar
        open={alert.isOpen}
        onClose={handleCloseAlert}
        message={alert.message}
        severity={alert.severity}
      />
    </Stack>
  );
}

DetailOrder.propTypes = {
  initialValues: PropTypes.shape({
    orderId: PropTypes.number,
    customerId: PropTypes.number,
    fullName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    orderDate: PropTypes.string,
    orderCode: PropTypes.string,
    voucherId: PropTypes.number,
    totalAmount: PropTypes.number,
    status: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    shippingAddress: PropTypes.string,
    paymentMethod: PropTypes.string,
    orderItems: PropTypes.arrayOf(
      PropTypes.shape({
        orderItemId: PropTypes.number,
        productId: PropTypes.number,
        productName: PropTypes.string,
        description: PropTypes.string,
        quantity: PropTypes.number,
        price: PropTypes.number,
        totalPrice: PropTypes.number,
        productImages: PropTypes.arrayOf(
          PropTypes.shape({
            productImageId: PropTypes.number,
            imageUrl: PropTypes.string,
          })
        ),
      })
    ),
  }).isRequired,
};
