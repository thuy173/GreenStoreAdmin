import * as yup from 'yup';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Stack,
  Button,
  Select,
  MenuItem,
  Checkbox,
  TextField,
  Typography,
  InputLabel,
  Breadcrumbs,
  FormControl,
  Autocomplete,
  ListItemText,
} from '@mui/material';

import LoadingPage from 'src/pages/loading_page';
import ProductServices from 'src/services/ProductServices';
import CategoryServices from 'src/services/CategoryServices';
import NutrientServices from 'src/services/NutrientServices';

import Link from 'src/components/link';
import DropZone from 'src/components/drop-zone';
import Iconify from 'src/components/iconify/iconify';
import CustomSnackbar from 'src/components/snackbar/snackbar';

function formatTime(date) {
  const years = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  //   const hours = date.getUTCHours().toString().padStart(2, '0');
  //   const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  //   const seconds = '00';
  //   const milliseconds = '000';

  //   return `${years}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
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

const AddProductView = () => {
  const navigate = useNavigate();
  const [manufactureDate, setManufactureDate] = useState();
  const [expiryDate, setExpiryDate] = useState();
  const [isEndTimeValidated, setIsEndTimeValidated] = useState(true);
  const [isInputBlurred, setIsInputBlurred] = useState(false);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [nutrient, setNutrient] = useState([]);
  const [selectNutrient, setSelectNutrient] = useState([]);
  const [numImage, setNumImage] = useState(1);
  const [imageData, setImageData] = useState({ answers: [], answerFiles: [] });
  const [imagePreviewProduct, setImagePreviewProduct] = useState(Array(numImage).fill(null));

  const [alert, setAlert] = useState({ message: null, severity: 'success', isOpen: false });

  const showAlert = (severity, message) => {
    setAlert({ severity, message, isOpen: true });
  };

  const handleCloseAlert = () => {
    setAlert({ message: null, severity: 'success', isOpen: false });
  };

  const unitOfMeasureOptions = ['Kg', 'Bottle', 'Bag', 'Piece', 'Liter'];

  const initialValues = {
    productName: '',
    description: '',
    price: '',
    quantityInStock: '',
    unitOfMeasure: '',
  };

  const validationSchema = yup.object().shape({
    productName: yup.string().required('This field is required.'),
    price: yup
      .number()
      .required('This field is required.')
      .positive('Price must be a positive number.'),
    quantityInStock: yup
      .number()
      .required('This field is required.')
      .positive('Quantity must be a positive number.'),
    unitOfMeasure: yup.string().required('This field is required.'),
  });

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

  const renderNutrientName = (selected) => {
    const selectNutrients = nutrient.filter((n) => selected.includes(n.nutrientId));
    return selectNutrients.map((n) => n.nutrientName).join(', ');
  };

  const handleNutrientChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectNutrient(typeof value === 'string' ? value.split(',') : value);
  };

  const handleAddImage = () => {
    setNumImage((prevNum) => prevNum + 1);
    setImagePreviewProduct((prevPreviews) => [...prevPreviews, null]);
  };

  const handleDeleteImages = (index) => {
    if (numImage > 1) {
      setNumImage((prevNum) => prevNum - 1);

      const newAnswers = [...imageData.answers];
      const newAnswerFiles = [...imageData.answerFiles];
      newAnswers.splice(index, 1);
      newAnswerFiles.splice(index, 1);

      setImageData((prevData) => ({
        ...prevData,
        answers: newAnswers,
        answerFiles: newAnswerFiles,
      }));

      setImagePreviewProduct((prevPreviews) => {
        const newPreviews = [...prevPreviews];
        newPreviews.splice(index, 1);
        return newPreviews;
      });
    }
  };

  const handleImageUpload = (files, index) => {
    const newAnswers = [...imageData.answers];
    const newAnswerFiles = [...imageData.answerFiles];

    // Ensure files is an array
    const filesArray = Array.isArray(files) ? files : [files];

    newAnswers[index] = filesArray.map((file) => URL.createObjectURL(file));
    newAnswerFiles[index] = filesArray;

    setImageData((prevData) => ({
      ...prevData,
      answers: newAnswers,
      answerFiles: newAnswerFiles,
    }));

    setImagePreviewProduct((prevPreviews) => {
      const newPreviews = [...prevPreviews];
      newPreviews[index] = filesArray.map((file) => URL.createObjectURL(file));
      return newPreviews;
    });
  };

  const handleAdd = async (values, { setSubmitting }) => {
    if (values.price <= 0) {
      showAlert('error', 'Price must be a number and cannot be negative.');
      return;
    }
    const formattedManufactureDate = manufactureDate ? new Date(manufactureDate) : null;
    const formattedExpiryDate = expiryDate ? new Date(expiryDate) : null;
    try {
      const formData = new FormData();
      formData.append('productName ', values.productName);
      formData.append('price ', values.price);
      formData.append('quantityInStock ', values.quantityInStock);
      formData.append('description', values.description);
      formData.append('unitOfMeasure', values.unitOfMeasure);
      formData.append('categoryId', selectedCategory);
      formData.append('nutrientIds', selectNutrient);

      if (formattedManufactureDate) {
        formData.append('manufactureDate', formatTime(formattedManufactureDate));
      }

      if (formattedExpiryDate) {
        formData.append('expiryDate', formatTime(formattedExpiryDate));
      }

      imageData.answerFiles.forEach((fileArray, index) => {
        fileArray.forEach((file, fileIndex) => {
          formData.append(`productImages`, file);
        });
      });

      const response = await ProductServices.addData(formData);

      if (response.status === 200) {
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

  useEffect(() => {
    fetchCategoryData();
    fetchNutrientData();
  }, []);

  return (
    <Stack p={3}>
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
                        fullWidth
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
                        label="Quantity In Stock *"
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
                      <FormControl fullWidth>
                        <Autocomplete
                          options={unitOfMeasureOptions.map((option) => option.toUpperCase())}
                          value={values.unitOfMeasure}
                          onChange={(event, newValue) => {
                            handleChange({
                              target: {
                                name: 'unitOfMeasure',
                                value: newValue,
                              },
                            });
                          }}
                          onBlur={handleBlur}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Unit of Measure*"
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
                    >
                      <Stack sx={{ width: '100%' }}>
                        <Typography>Manufacture Date</Typography>
                        <TextField
                          variant="outlined"
                          type="datetime-local"
                          onChange={(e) => setManufactureDate(e.target.value)}
                          name="manufactureDate"
                        />
                      </Stack>
                      <Stack sx={{ width: '100%' }}>
                        <Typography>Expiry Date</Typography>
                        <TextField
                          variant="outlined"
                          type="datetime-local"
                          onChange={(e) => {
                            setExpiryDate(e.target.value);
                            setIsInputBlurred(false);
                          }}
                          onBlur={() => setIsInputBlurred(true)}
                          name="expiryDate"
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
                    >
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                          labelId="category-label"
                          id="category"
                          value={selectedCategory || ''}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          label="category"
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
                    <Stack direction="column" spacing={2}>
                      <Typography variant="h6">Product image</Typography>
                      {Array.from({ length: numImage }).map((_, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                          <Button
                            color="error"
                            onClick={() => handleDeleteImages(index)}
                            sx={{ margin: -1.5 }}
                          >
                            <Iconify icon="eva:trash-2-fill" />
                          </Button>
                          <Grid item xs={6} sx={{ ml: 3, pb: 5 }}>
                            <Stack direction="column" spacing={2}>
                              <DropZone
                                onDrop={(files) => handleImageUpload(files, index)}
                                imagePreview={imagePreviewProduct[index]}
                                setImagePreview={(previews) =>
                                  setImagePreviewProduct((prev) => {
                                    const newPreviews = [...prev];
                                    newPreviews[index] = previews;
                                    return newPreviews;
                                  })
                                }
                              />
                            </Stack>
                          </Grid>
                        </Box>
                      ))}
                      <Stack>
                        <Button
                          sx={{ width: '21%', marginLeft: '40px' }}
                          variant="contained"
                          color="primary"
                          onClick={handleAddImage}
                          startIcon={<Iconify icon="eva:plus-fill" />}
                        >
                          Add image
                        </Button>
                      </Stack>
                    </Stack>
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
