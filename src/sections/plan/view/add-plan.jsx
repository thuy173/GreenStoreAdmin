import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Grid,
  Button,
  Dialog,
  MenuItem,
  Container,
  TextField,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
} from '@mui/material';

import PlanServices from 'src/services/PlanServices';
import ComboServices from 'src/services/ComboServices';
import CustomerServices from 'src/services/CustomerServices';

import CustomSnackbar from 'src/components/snackbar/snackbar';

const CreatePlanView = () => {
  const [customers, setCustomerData] = useState([]);
  const [combos, setComboData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedCombo, setSelectedCombo] = useState('');
  const [startDate, setStartDate] = useState(dayjs());
  const [schedules, setSchedules] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [alert, setAlert] = useState({ message: null, severity: 'success', isOpen: false });

  const showAlert = (severity, message) => {
    setAlert({ severity, message, isOpen: true });
  };

  const handleCloseAlert = () => {
    setAlert({ message: null, severity: 'success', isOpen: false });
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

  useEffect(() => {
    if (selectedCombo && startDate) {
      const combo = combos.find((c) => c.comboId === selectedCombo);
      if (combo) {
        const { duration } = combo;
        const newSchedules = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < duration; i++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          newSchedules.push({
            date: date.toISOString().split('T')[0],
            scheduledProducts: combo.comboProducts.map((cp) => ({
              comboProductId: cp.comboProductId,
              quantity: 1, // Default quantity
              dayInRegimen: i + 1,
            })),
          });
        }
        setSchedules(newSchedules);
      }
    }
  }, [selectedCombo, startDate, combos]);

  const handleDateClick = (schedule) => {
    setCurrentSchedule(schedule);
    setOpenDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = {
      customerId: selectedCustomer,
      comboId: selectedCombo,
      startDate: startDate.format('YYYY-MM-DD'),
      schedules,
    };
    try {
      const response = await PlanServices.addData(credentials);
      if (response.status === 200) {
        showAlert('success', 'Add plan successfully!');
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
  };

  useEffect(() => {
    fetchComboData();
    fetchCustomerData();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Create Plan
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
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
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Combo"
              value={selectedCombo}
              onChange={(e) => setSelectedCombo(e.target.value)}
              fullWidth
            >
              {combos.map((combo) => (
                <MenuItem key={combo.comboId} value={combo.comboId}>
                  {combo.comboName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Start Date</Typography>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              openTo="day"
              value={startDate}
              onChange={(newDate) => setStartDate(newDate)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Schedules</Typography>
            {schedules.map((schedule, index) => (
              <Button
                key={index}
                variant="outlined"
                fullWidth
                onClick={() => handleDateClick(schedule)}
              >
                {`Day ${index + 1} (${schedule.date})`}
              </Button>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Create Plan
            </Button>
          </Grid>
        </Grid>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
          <DialogTitle>
            Schedule Details
            <IconButton
              aria-label="close"
              onClick={() => setOpenDialog(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {currentSchedule && (
              <>
                <Typography variant="h6">{`Date: ${currentSchedule.date}`}</Typography>
                {currentSchedule.scheduledProducts.map((product, index) => (
                  <Typography
                    key={index}
                  >{`Product ID: ${product.comboProductId}, Quantity: ${product.quantity}`}</Typography>
                ))}
              </>
            )}
          </DialogContent>
        </Dialog>
      </Container>
      <CustomSnackbar
        open={alert.isOpen}
        onClose={handleCloseAlert}
        message={alert.message}
        severity={alert.severity}
      />
    </LocalizationProvider>
  );
};

export default CreatePlanView;
