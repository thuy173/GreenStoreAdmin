import * as yup from 'yup';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import FaceIcon from '@mui/icons-material/Face';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import {
  Card,
  Stack,
  Button,
  TextField,
  FormLabel,
  CardMedia,
  Typography,
  Pagination,
  IconButton,
  Breadcrumbs,
  FormControl,
  CardContent,
  CardActions,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import LoadingPage from 'src/pages/loading_page';
import ComboServices from 'src/services/ComboServices';
import ProductServices from 'src/services/ProductServices';

import Link from 'src/components/link';
import CustomSnackbar from 'src/components/snackbar/snackbar';

const AddComboView = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [alert, setAlert] = useState({ message: null, severity: 'success', isOpen: false });

  const handleCloseAlert = () => {
    setAlert({ message: null, severity: 'success', isOpen: false });
  };

  const BMIStatusOption = [
    { label: 'UNDERWEIGHT', icon: <AccessibilityNewIcon /> },
    { label: 'NORMAL', icon: <FaceIcon /> },
    { label: 'OVERWEIGHT', icon: <FastfoodIcon /> },
    { label: 'OBESE', icon: <FitnessCenterIcon /> },
  ];

  const initialValues = {
    comboName: '',
    description: '',
    bmiStatus: 'NORMAL',
    duration: 0,
  };

  const validationSchema = yup.object().shape({
    comboName: yup.string().required('This field is required.'),
    duration: yup
      .number()
      .min(1, 'Duration must be at least 1 day.')
      .required('This field is required.'),
  });

  const handleAdd = async (values, { setSubmitting }) => {
    const payload = {
      ...values,
      products: selectedProducts,
    };

    try {
      const response = await ComboServices.addData(payload);

      if (response.status === 200) {
        localStorage.setItem('addCombo', 'true');
        navigate('/combo');
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

  const fetchProductData = async () => {
    try {
      const response = await ProductServices.getDataPagination(page - 1, pageSize);
      if (response?.data && response?.status === 200) {
        setProductData(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        console.error(response ?? 'Unexpected response structure');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchProductData(page, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleProductAdd = (productId) => {
    setSelectedProducts((prevSelected) => {
      const existingProduct = prevSelected.find((product) => product.productId === productId);

      if (existingProduct) {
        return prevSelected.map((product) =>
          product.productId === productId ? { ...product, quantity: product.quantity + 1 } : product
        );
      }

      return [...prevSelected, { productId, quantity: 1 }];
    });
  };

  const handleProductRemove = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.filter((product) => product.productId !== productId)
    );
  };

  return (
    <Stack px={2}>
      <Formik
        onSubmit={(values, actions) => {
          console.log('onSubmit called');
          handleAdd(values, actions);
        }}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <>
            <Stack direction="row" alignItems="center">
              <Breadcrumbs
                separator={<NavigateNextIcon fontSize="large" />}
                aria-label="breadcrumb"
              >
                <Link href="/">
                  <Stack direction="row" alignItems="center">
                    <Typography variant="body1">Dashboard</Typography>
                  </Stack>
                </Link>
                <Link href="/combo">
                  <Typography variant="body1">Combo</Typography>
                </Link>
                <Typography variant="body1" color="text.primary">
                  Add combo
                </Typography>
              </Breadcrumbs>
            </Stack>
            <form onSubmit={handleSubmit}>
              {isSubmitting ? (
                <LoadingPage />
              ) : (
                <Stack p={2}>
                  <Stack direction="column" justifyContent="center" spacing={2} marginBottom={3}>
                    <Stack>
                      <TextField
                        id="outlined-basic"
                        label="Combo name*"
                        variant="outlined"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.comboName ? values.comboName : ''}
                        name="comboName"
                        fullWidth
                        error={!!touched.comboName && !!errors.comboName}
                        helperText={touched.comboName && errors.comboName}
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
                      justifyContent="center"
                      alignItems="center"
                      spacing={2}
                      pt={2}
                    >
                      <FormControl component="fieldset" fullWidth>
                        <FormLabel
                          sx={{ textAlign: 'center', mb: 1, fontWeight: 'bold', color: 'black' }}
                          component="legend"
                        >
                          BMI Status*
                        </FormLabel>
                        <ToggleButtonGroup
                          exclusive
                          value={values.bmiStatus}
                          onChange={(event, newValue) => {
                            setFieldValue('bmiStatus', newValue);
                          }}
                          onBlur={handleBlur}
                          fullWidth
                        >
                          {BMIStatusOption.map((option) => (
                            <ToggleButton key={option.label} value={option.label}>
                              {option.icon}
                              {option.label}
                            </ToggleButton>
                          ))}
                        </ToggleButtonGroup>
                        {touched.bmiStatus && errors.bmiStatus && (
                          <Typography color="error">{errors.bmiStatus}</Typography>
                        )}
                      </FormControl>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1} width="26%">
                      <Button
                        variant="outlined"
                        onClick={() => setFieldValue('duration', Math.max(1, values.duration - 1))}
                      >
                        -
                      </Button>
                      <TextField
                        label="Duration*"
                        variant="outlined"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.duration}
                        name="duration"
                        type="number"
                        fullWidth
                        error={!!touched.duration && !!errors.duration}
                        helperText={touched.duration && errors.duration}
                        inputProps={{ readOnly: true }}
                      />
                      <Button
                        variant="outlined"
                        onClick={() => setFieldValue('duration', values.duration + 1)}
                      >
                        +
                      </Button>
                    </Stack>
                  </Stack>

                  <Grid container spacing={2} mt={2} mb={4}>
                    {productData.map((product) => {
                      const isSelected = selectedProducts.some(
                        (selected) => selected.productId === product.productId
                      );

                      return (
                        <Grid xs={6} md={4} key={product.productId}>
                          <Card>
                            <CardMedia
                              component="img"
                              height="140"
                              image={product.productImages[0]?.imageUrl}
                              alt={product.productName}
                              style={{ filter: isSelected ? 'grayscale(100%)' : 'none' }}
                            />
                            <CardContent>
                              <Typography variant="h6" component="div">
                                {product.productName}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  display: '-webkit-box',
                                  WebkitBoxOrient: 'vertical',
                                  WebkitLineClamp: 3,
                                  overflow: 'hidden',
                                }}
                              >
                                {product.description}
                              </Typography>
                            </CardContent>
                            <CardActions>
                              <IconButton
                                color="success"
                                aria-label="add to combo"
                                onClick={() => handleProductAdd(product.productId)}
                                disabled={isSelected}
                              >
                                <AddCircleIcon />
                              </IconButton>
                            </CardActions>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>

                  <Pagination
                    shape="rounded"
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="success"
                    style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}
                  />

                  <Grid xs={12} mt={2}>
                    <Typography variant="h6" component="div" mb={2}>
                      Selected Products
                    </Typography>
                    {selectedProducts.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No products selected.
                      </Typography>
                    ) : (
                      selectedProducts.map((selectedProduct) => {
                        const selectedProductData = productData.find(
                          (product) => product.productId === selectedProduct.productId
                        );

                        return (
                          <Card key={selectedProduct.productId} sx={{ mb: 2 }}>
                            <CardContent>
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <CardMedia
                                  component="img"
                                  height="80"
                                  image={selectedProductData.productImages[0]?.imageUrl}
                                  alt={selectedProductData.productName}
                                  sx={{ width: 80 }}
                                />
                                <Typography variant="body1">
                                  {selectedProductData.productName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Quantity: {selectedProduct.quantity}
                                </Typography>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  onClick={() => handleProductRemove(selectedProduct.productId)}
                                >
                                  Remove
                                </Button>
                              </Stack>
                            </CardContent>
                          </Card>
                        );
                      })
                    )}
                  </Grid>

                  <Grid xs={6} md={8}>
                    <Stack direction="row" justifyContent="space-between" spacing={2}>
                      <Button
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="success"
                      >
                        Add combo
                      </Button>
                    </Stack>
                  </Grid>
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

export default AddComboView;
