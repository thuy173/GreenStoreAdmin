import * as yup from 'yup';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Stack, Button, Select, MenuItem, TextField, Typography, InputLabel, Breadcrumbs, FormControl } from '@mui/material';

import LoadingPage from 'src/pages/loading_page';
import ProductServices from 'src/services/ProductServices';

import Link from 'src/components/link';
import DropZone from 'src/components/drop-zone';
import CustomSnackbar from 'src/components/snackbar/snackbar';

const initialValues = {
  productName: '',
  description: '',
  price: '',
  quantityInStock: '',
  manufactureDate: null,
  expiryDate: null,
  unitOfMeasure: '',
};

const unitOfMeasureOptions = ["Kg", "Bottle", "Bag", "Piece", "Liter"];

const AddProductView = () => {
  const navigate = useNavigate();

  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [, setThumbnail] = useState(null);

  const [alert, setAlert] = useState({ message: null, severity: 'success', isOpen: false });
  const showAlert = (severity, message) => {
    setAlert({ severity, message, isOpen: true });
  };

  const handleCloseAlert = () => {
    setAlert({ message: null, severity: 'success', isOpen: false });
  };

  const validationSchema = yup.object().shape({
    productName: yup.string().required('This field is required.'),
    price: yup.number().required('This field is required.').positive('Price must be a positive number.'),
    quantityInStock: yup.number().required('This field is required.').positive('Quantity must be a positive number.'),
    manufactureDate: yup.date().nullable().required('This field is required.'),
    expiryDate: yup.date().nullable().required('This field is required.'),
    unitOfMeasure: yup.string().required('This field is required.'),
  });

  const handleAdd = async (values, { setSubmitting }) => {
    if (values.price <= 0) {
      showAlert('error', 'Price must be a number and cannot be negative.');
      setSubmitting(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('productName', values.productName);
      formData.append('price', values.price);
      formData.append('quantityInStock', values.quantityInStock);
      formData.append('description', values.description);
      formData.append('manufactureDate', values.manufactureDate);
      formData.append('expiryDate', values.expiryDate);
      formData.append('unitOfMeasure', values.unitOfMeasure);
      formData.append('categoryId', values.categoryId);
      formData.append('nutrientIds', values.nutrientIds);
      formData.append('productImages', values.productImages);

      const response = await ProductServices.addData(formData);

      if (response.status === 201) {
        localStorage.setItem('addProduct', 'true');
        navigate('/product');
      } else {
        setAlert({
          message: response?.response?.data?.message || 'An error occurred. Please check again!',
          severity: 'error',
          isOpen: true,
        });
      }
    } catch (error) {
      setAlert({
        message: error.message || 'An error occurred.',
        severity: 'error',
        isOpen: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack p={3}>
      <Formik
        onSubmit={handleAdd}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({ values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
          <>
            <Stack direction="row" alignItems="center">
              <Breadcrumbs
                separator={<NavigateNextIcon fontSize="large" />}
                aria-label="breadcrumb"
              >
                <Link href="/">
                  <Stack direction="row" alignItems="center">
                    <HomeRoundedIcon sx={{ mr: 0.5 }} fontSize="medium" />
                    <Typography variant="body1">Dashboard</Typography>
                  </Stack>
                </Link>
                <Link href="/product">
                  <Typography variant="body1">Product</Typography>
                </Link>
                <Typography variant="body1" color="text.primary">
                  Add product
                </Typography>
              </Breadcrumbs>
            </Stack>
            <form onSubmit={handleSubmit}>
              {isSubmitting ? (
                <LoadingPage />
              ) : (
                <Stack px={3} py={5}>
                  <Stack direction="column" justifyContent="center" spacing={2} marginBottom={3}>
                    <Stack>
                      <TextField
                        id="outlined-basic"
                        label="Product name*"
                        variant="outlined"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.productName ? values.productName : ''}
                        name="productName"
                        error={!!touched.productName && !!errors.productName}
                        helperText={touched.productName && errors.productName}
                      />
                    </Stack>
                    <Stack>
                      <TextField
                        label="Description"
                        id="outlined-basic"
                        style={{ borderRadius: '2%' }}
                        variant="outlined"
                        onChange={handleChange}
                        value={values.description ? values.description : ''}
                        name="description"
                        multiline
                        rows={4}
                      />
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={2}
                    >
                      <TextField
                        id="outlined-basic"
                        label="Price*"
                        type="number"
                        variant="outlined"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.price ? values.price : ''}
                        name="price"
                        fullWidth
                        error={!!touched.price && !!errors.price}
                        helperText={touched.price && errors.price}
                      />
                      <TextField
                        id="outlined-basic"
                        label="Quantity In Stock*"
                        type="number"
                        variant="outlined"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.quantityInStock ? values.quantityInStock : ''}
                        name="quantityInStock"
                        fullWidth
                        error={!!touched.quantityInStock && !!errors.quantityInStock}
                        helperText={touched.quantityInStock && errors.quantityInStock}
                      />
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={2}
                    >
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Manufacture Date*"
                          value={values.manufactureDate}
                          onChange={(newValue) => setFieldValue('manufactureDate', newValue)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              onBlur={handleBlur}
                              fullWidth
                              name="manufactureDate"
                              error={!!touched.manufactureDate && !!errors.manufactureDate}
                              helperText={touched.manufactureDate && errors.manufactureDate}
                            />
                          )}
                        />
                        <DatePicker
                          label="Expiry Date*"
                          value={values.expiryDate}
                          onChange={(newValue) => setFieldValue('expiryDate', newValue)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              onBlur={handleBlur}
                              fullWidth
                              name="expiryDate"
                              error={!!touched.expiryDate && !!errors.expiryDate}
                              helperText={touched.expiryDate && errors.expiryDate}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Stack>
                    <FormControl fullWidth>
                      <InputLabel>Unit of Measure*</InputLabel>
                      <Select
                        name="unitOfMeasure"
                        value={values.unitOfMeasure}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!touched.unitOfMeasure && !!errors.unitOfMeasure}
                      >
                        {unitOfMeasureOptions.map(option => (
                          <MenuItem key={option} value={option.toLowerCase()}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.unitOfMeasure && errors.unitOfMeasure && (
                        <Typography color="error">{errors.unitOfMeasure}</Typography>
                      )}
                    </FormControl>
                    <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                      <Grid xs={6} sx={{ p: 0 }}>
                        <Box>
                          <Typography variant="h6">Product image</Typography>
                          <Stack direction="column" spacing={2}>
                            <DropZone
                              onDrop={setThumbnail}
                              imagePreview={thumbnailPreview}
                              setImagePreview={setThumbnailPreview}
                            />
                          </Stack>
                        </Box>
                      </Grid>
                    </Grid>
                  </Stack>

                  <Grid xs={6} md={8}>
                    <Stack direction="row" justifyContent="space-between" spacing={2}>
                      <Button
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        Add product
                      </Button>
                    </Stack>
                  </Grid>

                  <CustomSnackbar
                    open={alert.isOpen}
                    onClose={handleCloseAlert}
                    message={alert.message}
                    severity={alert.severity}
                  />
                </Stack>
              )}
            </form>
          </>
        )}
      </Formik>
      <CustomSnackbar
        open={alert.isOpen}
        onClose={handleCloseAlert}
        message={alert.message}
        severity={alert.severity}
      />
    </Stack>
  );
};

export default AddProductView;
