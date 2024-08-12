import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Box,
  Grid,
  Dialog,
  Button,
  MenuItem,
  TextField,
  Typography,
  DialogActions,
  DialogContent,
} from '@mui/material';

import PlanServices from 'src/services/PlanServices';
import ComboServices from 'src/services/ComboServices';
import CustomerServices from 'src/services/CustomerServices';

import CustomSnackbar from 'src/components/snackbar/snackbar';

import ColorPicker from './color-picker';

const AddPlanDialog = ({ open, handleClose }) => {
  const [calevents, setCalPlans] = useState();
  const [start, setStart] = useState();
  const [color, setColor] = useState('');
  const [update] = useState();
  const [customers, setCustomerData] = useState([]);
  const [combos, setComboData] = useState([]);
  const [comboProduct, setComboProductData] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedCombo, setSelectedCombo] = useState('');
  const [alert, setAlert] = useState({ message: null, severity: 'success', isOpen: false });

  const ColorVariation = [
    { id: 1, eColor: '#1a97f5', value: 'default' },
    { id: 2, eColor: '#39b69a', value: 'green' },
    { id: 3, eColor: '#fc4b6c', value: 'red' },
    { id: 4, eColor: '#615dff', value: 'azure' },
    { id: 5, eColor: '#fdd43f', value: 'warning' },
  ];

  const handleCloseAlert = () => {
    setAlert({ message: null, severity: 'success', isOpen: false });
  };

  const showAlert = (severity, message) => {
    setAlert({ severity, message, isOpen: true });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const schedules = comboProduct.comboProducts.map((product, index) => {
      const dayCount = moment(product.endDate).diff(moment(product.startDate), 'days') + 1;

      const scheduledProducts = [];
      // eslint-disable-next-line no-plusplus
      for (let day = 0; day < dayCount; day++) {
        scheduledProducts.push({
          comboProductId: product.comboProductId,
          quantity: product.quantity,
          dayInRegimen: day + 1,
        });
      }

      return {
        date: product.date || moment(start).add(index, 'days').format('YYYY-MM-DD'),
        scheduledProducts,
      };
    });

    const credentials = {
      customerId: selectedCustomer,
      comboId: selectedCombo,
      startDate: moment(start).format('YYYY-MM-DD'),
      schedules,
    };

    try {
      const response = await PlanServices.addData(credentials);
      if (response.status === 200) {
        showAlert('success', 'Plan added successfully!');
      } else {
        setAlert({
          message: response?.response?.data?.message || 'An error occurred. Please check again!',
          severity: 'error',
          isOpen: true,
        });
      }
    } catch (error) {
      console.error('Failed to add plan:', error);
      setAlert({
        message: error.message || 'An error occurred.',
        severity: 'error',
        isOpen: true,
      });
    }
    handleClose();
    e.target.reset();
    setCalPlans([...calevents, credentials]);
    setStart(new Date());
  };

  const handleStartChange = (newValue) => {
    setStart(newValue);
  };
  const fetchComboData = async () => {
    try {
      const response = await ComboServices.getByBmi('UNDERWEIGHT');
      if (response?.data && response?.status === 200) {
        setComboData(response.data);
      } else {
        console.error(response ?? 'Unexpected response structure');
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const fetchCustomerData = async () => {
    try {
      const response = await CustomerServices.getAll();
      if (response?.data && response?.status === 200) {
        setCustomerData(response.data);
      } else {
        console.error(response ?? 'Unexpected response structure');
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const fetchComboById = async (comboId) => {
    try {
      const response = await ComboServices.getById(comboId);
      if (response?.data && response?.status === 200) {
        setComboProductData(response.data);
      } else {
        console.error(response ?? 'Unexpected response structure');
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleComboChange = (event) => {
    const selectedComboId = event.target.value;
    setSelectedCombo(selectedComboId);
    fetchComboById(selectedComboId);
  };

  const handleProductDateChange = (index, field, value) => {
    const updatedProducts = [...comboProduct.comboProducts];
    updatedProducts[index][field] = value;
    setComboProductData({
      ...comboProduct,
      comboProducts: updatedProducts,
    });
  };
  useEffect(() => {
    fetchComboData();
    fetchCustomerData();
  }, []);
  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <form onSubmit={submitHandler}>
          <DialogContent>
            <Typography variant="h4" sx={{ mb: 1 }}>
              {update ? 'Update Plan' : 'Add Plan'}
            </Typography>

            <Box display="flex" gap={2} mb={2}>
              <TextField
                select
                label="Customer"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                fullWidth
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.customerId} value={customer.customerId}>
                    {customer.fullName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Combo"
                value={selectedCombo}
                onChange={handleComboChange}
                fullWidth
              >
                {combos.map((combo) => (
                  <MenuItem key={combo.comboId} value={combo.comboId}>
                    {combo.comboName}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            {comboProduct && (
              <Box my={2}>
                <Grid container spacing={2}>
                  {comboProduct.comboProducts.map((product, index) => (
                    <Grid item xs={12} sm={6} md={4} key={product.comboProductId}>
                      <Box mt={1} p={2} border={1}>
                        <Typography variant="subtitle1">
                          Product Name: {product.products[0].productName}
                        </Typography>
                        <Typography variant="body2">
                          Quantity: {product.quantity} {product.products[0].unitOfMeasure}
                        </Typography>
                        <Typography variant="body2">Price: ${product.products[0].price}</Typography>
                        <img
                          src={product.products[0].productImages[0].imageUrl}
                          alt={product.products[0].productName}
                          style={{ width: '100px', height: '100px' }}
                        />

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="Date"
                            inputFormat="MM/dd/yyyy"
                            value={product.date || start}
                            onChange={(newValue) =>
                              handleProductDateChange(index, 'date', newValue)
                            }
                            renderInput={(params) => (
                              <TextField {...params} fullWidth sx={{ mt: 2 }} />
                            )}
                          />
                        </LocalizationProvider>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                inputFormat="MM/dd/yyyy"
                value={start}
                onChange={handleStartChange}
                renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
              />
            </LocalizationProvider>

            <Box display="flex" alignItems="center" mt={2}>
              <Typography variant="body1" sx={{ marginRight: '12px' }}>
                Color:
              </Typography>
              <ColorPicker colors={ColorVariation} selectedColor={color} onColorSelect={setColor} />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose}>Cancel</Button>

            <Button type="submit" disabled={!combos && !customers} variant="contained">
              {update ? 'Update Plan' : 'Add Plan'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <CustomSnackbar
        open={alert.isOpen}
        onClose={handleCloseAlert}
        message={alert.message}
        severity={alert.severity}
      />
    </>
  );
};

AddPlanDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default AddPlanDialog;
