import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Card,
  Stack,
  Button,
  Select,
  MenuItem,
  Checkbox,
  Backdrop,
  TextField,
  Typography,
  InputLabel,
  Breadcrumbs,
  FormControl,
  Autocomplete,
  ListItemText,
  CircularProgress,
} from '@mui/material';

import LoadingPage from 'src/pages/loading_page';
import ProductServices from 'src/services/ProductServices';
import CategoryServices from 'src/services/CategoryServices';
import NutrientServices from 'src/services/NutrientServices';

import Link from 'src/components/link';
import DropZone from 'src/components/drop-zone';
import CustomSnackbar from 'src/components/snackbar/snackbar';

function formatTime(date) {
  const years = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');

  return `${years}-${month}-${day}`;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const EditProductForm = ({ initialValues, onLoadData }) => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ message: null, severity: 'success', isOpen: false });
  const [loading, setLoading] = useState(false);
  const unitOfMeasureOptions = ['Kg', 'Bottle', 'Bag', 'Piece', 'Liter'];
  const [manufactureDate, setManufactureDate] = useState(initialValues.manufactureDate || '');
  const [expiryDate, setExpiryDate] = useState(initialValues.expiryDate || '');
  const [isEndTimeValidated, setIsEndTimeValidated] = useState(true);
  const [isInputBlurred, setIsInputBlurred] = useState(false);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [, setImages] = useState(null);
  const [nutrient, setNutrient] = useState([]);
  const [selectNutrient, setSelectNutrient] = useState(
    initialValues.nutrients ? initialValues.nutrients.map((n) => n.nutrientId) : []
  );

  const handleCloseAlert = () => {
    setAlert({ message: null, severity: 'success', isOpen: false });
  };

  const showAlert = (severity, message) => {
    setAlert({ severity, message, isOpen: true });
  };

  const handleDropzoneClose = () => {
    setImages(null);
  };

  const isEndTimeValid = () => {
    if (!manufactureDate || !expiryDate) return false;
    const startTime = new Date(manufactureDate).getTime();
    const endTime = new Date(expiryDate).getTime();
    return endTime >= startTime;
  };

  useEffect(() => {
    setIsEndTimeValidated(isEndTimeValid());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manufactureDate, expiryDate]);

  const renderNutrientName = (selected) =>
    selected.map((value) => nutrient.find((n) => n.nutrientId === value)?.nutrientName).join(', ');

  const handleNutrientChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectNutrient(typeof value === 'string' ? value.split(',') : value);
  };

  const fetchCategoryData = async () => {
    try {
      const response = await CategoryServices.getAll();
      if (response?.data && response?.status === 200) {
        setCategory(response.data);
      } else {
        console.error(response ?? 'Unexpected response structure');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchNutrientData = async () => {
    try {
      const response = await NutrientServices.getAll();
      if (response?.data && response?.status === 200) {
        setNutrient(response.data);
      } else {
        console.error(response ?? 'Unexpected response structure');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (category.length > 0 && initialValues.categoryName) {
      const matchedCategory = category.find((c) => c.categoryName === initialValues.categoryName);
      if (matchedCategory) {
        setSelectedCategory(matchedCategory.categoryId);
      }
    }
  }, [category, initialValues.categoryName]);

  useEffect(() => {
    fetchCategoryData();
    fetchNutrientData();
  }, []);

  const handleEdit = async (values, { setSubmitting }) => {
    const formattedManufactureDate = manufactureDate ? new Date(manufactureDate) : null;
    const formattedExpiryDate = expiryDate ? new Date(expiryDate) : null;
    try {
      const formData = new FormData();
      formData.append('productName', values.productName);
      formData.append('description', values.description);
      formData.append('price', values.price);
      formData.append('quantityInStock', values.quantityInStock);
      formData.append('unitOfMeasure', values.unitOfMeasure);
      formData.append('categoryId', selectedCategory);
      formData.append('nutrientIds', selectNutrient.join(','));

      if (formattedManufactureDate) {
        formData.append('manufactureDate', formatTime(formattedManufactureDate));
      }

      if (formattedExpiryDate) {
        formData.append('expiryDate', formatTime(formattedExpiryDate));
      }

      const response = await ProductServices.editData(initialValues.productId, formData);

      if (response.status === 200) {
        localStorage.setItem('updateProduct', 'true');
        navigate('/product');
      } else {
        setAlert({
          message: response?.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng kiểm tra lại!',
          severity: 'error',
          isOpen: true,
        });
      }
    } catch (error) {
      setAlert({
        message: error.message || 'Đã xảy ra lỗi.',
        severity: 'error',
        isOpen: true,
      });
    } finally {
      setSubmitting(false);
    }
  };
  const handleAddImage = async (image) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image ', image);
      const response = await ProductServices.addImages(initialValues.productId, formData);
      if (response.status === 200) {
        showAlert('success', 'Add image successfully');
        onLoadData();
        setImagePreview(null);
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
      setLoading(false);
    }
  };

  const handleDrop = (file) => {
    setImages(file);
    handleAddImage(file);
  };

  return (
    <Formik onSubmit={handleEdit} initialValues={initialValues}>
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
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="large" />} aria-label="breadcrumb">
              <Link href="/">
                <Stack direction="row" alignItems="center">
                  <Typography variant="body1">Dashboard</Typography>
                </Stack>
              </Link>

              <Link href="/product">
                <Typography variant="body1">Product</Typography>
              </Link>

              <Typography variant="body1" color="text.primary">
                Update
              </Typography>
            </Breadcrumbs>
          </Stack>
          <form onSubmit={handleSubmit}>
            {isSubmitting ? (
              <LoadingPage />
            ) : (
              <Box sx={{ flexGrow: 1 }}>
                <Grid spacing={3}>
                  <Grid xs={6} md={8}>
                    <Stack direction="column" spacing={2} p={3} gap={1}>
                      <TextField
                        id="productName"
                        label="Product name"
                        variant="outlined"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.productName}
                        name="productName"
                        error={!!touched.productName && !!errors.productName}
                        helperText={touched.productName && errors.productName}
                      />
                      <TextField
                        label="Description"
                        id="description"
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
                      px={3}
                    >
                      <TextField
                        id="price"
                        type="number"
                        label="Price"
                        variant="outlined"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.price}
                        name="price"
                        fullWidth
                        error={!!touched.price && !!errors.price}
                        helperText={touched.price && errors.price}
                      />
                      <TextField
                        id="quantityInStock"
                        type="number"
                        label="Quantity In Stock"
                        variant="outlined"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.quantityInStock}
                        name="quantityInStock"
                        fullWidth
                        error={!!touched.quantityInStock && !!errors.quantityInStock}
                        helperText={touched.quantityInStock && errors.quantityInStock}
                      />
                      <FormControl fullWidth>
                        <Autocomplete
                          options={unitOfMeasureOptions.map((option) => option.toUpperCase())}
                          value={values.unitOfMeasure}
                          onChange={(event, newValue) => {
                            setFieldValue('unitOfMeasure', newValue);
                          }}
                          onBlur={handleBlur}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Unit of Measure"
                              error={!!touched.unitOfMeasure && !!errors.unitOfMeasure}
                            />
                          )}
                        />
                        {touched.unitOfMeasure && errors.unitOfMeasure && (
                          <Typography color="error">{errors.unitOfMeasure}</Typography>
                        )}
                      </FormControl>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      justifyContent="space-between"
                      px={3}
                      pt={2}
                    >
                      <Stack sx={{ width: '100%' }}>
                        <Typography>Manufacture Date</Typography>
                        <TextField
                          variant="outlined"
                          type="date"
                          onChange={(e) => {
                            setManufactureDate(e.target.value);
                            setFieldValue('manufactureDate', e.target.value);
                          }}
                          name="manufactureDate"
                          value={values.manufactureDate || ''}
                        />
                      </Stack>
                      <Stack sx={{ width: '100%' }}>
                        <Typography>Expiry Date</Typography>
                        <TextField
                          variant="outlined"
                          type="date"
                          onChange={(e) => {
                            setExpiryDate(e.target.value);
                            setFieldValue('expiryDate', e.target.value);
                            setIsInputBlurred(false);
                          }}
                          onBlur={() => setIsInputBlurred(true)}
                          name="expiryDate"
                          value={values.expiryDate || ''}
                          sx={{ width: '100%' }}
                          error={!isEndTimeValidated && isInputBlurred}
                          helperText={
                            !isEndTimeValidated &&
                            isInputBlurred &&
                            'Expiration date must be after manufacture date'
                          }
                        />
                      </Stack>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      justifyContent="space-between"
                      p={3}
                    >
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                          labelId="category-label"
                          id="category"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          label="Category"
                        >
                          {category.map((c) => (
                            <MenuItem key={c.categoryId} value={c.categoryId}>
                              {c.categoryName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="nutrient-label">Nutrient</InputLabel>
                        <Select
                          labelId="nutrient-label"
                          multiple
                          value={selectNutrient}
                          renderValue={renderNutrientName}
                          onChange={handleNutrientChange}
                          label="nutrient"
                          MenuProps={MenuProps}
                        >
                          {nutrient.map((item) => (
                            <MenuItem key={item.nutrientId} value={item.nutrientId}>
                              <Checkbox checked={selectNutrient.indexOf(item.nutrientId) > -1} />
                              <ListItemText primary={item.nutrientName} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item container spacing={2} px={2}>
                    {initialValues.productImages.map((image) => (
                      <Grid item xs={6} md={4} lg={3} key={image.productImageId}>
                        <Card
                          style={{
                            width: '200px',
                            height: '200px',
                            margin: '10px',
                            overflow: 'hidden',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: '1px solid #507c5c',
                          }}
                        >
                          <img
                            src={image.imageUrl}
                            alt={initialValues.productName}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'fit',
                            }}
                          />
                        </Card>
                      </Grid>
                    ))}
                    <Grid item xs={6} md={4} lg={3}>
                      <Card
                        style={{
                          width: '200px',
                          height: '200px',
                          margin: '10px',
                          overflow: 'hidden',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#f8f9fa',
                        }}
                      >
                        <DropZone
                          onDrop={handleDrop}
                          imagePreview={imagePreview}
                          setImagePreview={setImagePreview}
                          onDropzoneClose={handleDropzoneClose}
                          sx={{ padding: '50%' }}
                        />
                      </Card>
                    </Grid>
                  </Grid>

                  <Grid xs={6} md={8} px={3} pt={3}>
                    <Button
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="success"
                    >
                      Update
                    </Button>
                  </Grid>
                </Grid>
                <CustomSnackbar
                  open={alert.isOpen}
                  onClose={handleCloseAlert}
                  message={alert.message}
                  severity={alert.severity}
                />
                <Backdrop open={loading} style={{ color: '#fff', zIndex: 1400 }}>
                  <CircularProgress color="inherit" />
                </Backdrop>
              </Box>
            )}
          </form>
        </>
      )}
    </Formik>
  );
};

EditProductForm.propTypes = {
  onLoadData: PropTypes.func,
  initialValues: PropTypes.shape({
    productId: PropTypes.any,
    productName: PropTypes.any,
    price: PropTypes.any,
    quantityInStock: PropTypes.any,
    description: PropTypes.any,
    manufactureDate: PropTypes.any,
    expiryDate: PropTypes.any,
    unitOfMeasure: PropTypes.any,
    categoryName: PropTypes.any,
    nutrients: PropTypes.arrayOf(
      PropTypes.shape({
        nutrientId: PropTypes.number,
        nutrientName: PropTypes.string,
      })
    ),
    productImages: PropTypes.arrayOf(
      PropTypes.shape({
        productImageId: PropTypes.number,
        imageUrl: PropTypes.string,
      })
    ),
    rating: PropTypes.number,
    ratingList: PropTypes.arrayOf(
      PropTypes.shape({
        ratingId: PropTypes.number,
        ratingValue: PropTypes.number,
        createAt: PropTypes.string,
      })
    ),
    review: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};

export default EditProductForm;
