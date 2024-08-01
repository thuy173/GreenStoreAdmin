import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';

import CloseIcon from '@mui/icons-material/Close';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Grid,
  Button,
  Dialog,
  MenuItem,
  TextField,
  Container,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  const [currentSchedule, ] = useState(null);
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
    fetchComboData();
    fetchCustomerData();
  }, []);

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
            scheduledProducts: [],
          });
        }
        setSchedules(newSchedules);
      }
    }
  }, [selectedCombo, startDate, combos]);


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

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const newSchedules = Array.from(schedules);
    const sourceSchedule = newSchedules[source.droppableId];
    const destinationSchedule = newSchedules[destination.droppableId];
    const [removedProduct] = sourceSchedule.scheduledProducts.splice(source.index, 1);
    destinationSchedule.scheduledProducts.splice(destination.index, 0, removedProduct);
    setSchedules(newSchedules);
  };

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
            <DragDropContext onDragEnd={handleDragEnd}>
              <Grid container spacing={2}>
                {schedules.map((schedule, index) => (
                  <Grid item xs={12} key={index}>
                    <Droppable droppableId={index.toString()}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}
                        >
                          <Typography variant="h6">{`Day ${index + 1} (${schedule.date})`}</Typography>
                          {schedule.scheduledProducts.map((product, idx) => (
                            <Draggable
                              key={product.comboProductId}
                              draggableId={product.comboProductId.toString()}
                              index={idx}
                            >
                              {(provide) => (
                                <div
                                  ref={provide.innerRef}
                                  {...provide.draggableProps}
                                  {...provide.dragHandleProps}
                                  style={{
                                    ...provide.draggableProps.style,
                                    padding: '8px',
                                    marginBottom: '8px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    backgroundColor: '#f4f4f4',
                                  }}
                                >
                                  <Typography>{`Product ID: ${product.comboProductId}, Quantity: ${product.quantity}`}</Typography>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </Grid>
                ))}
              </Grid>
            </DragDropContext>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Create Plan
            </Button>
          </Grid>
        </Grid>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
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
              <div>
                <Typography variant="h6">{`Date: ${currentSchedule.date}`}</Typography>
                {currentSchedule.scheduledProducts.map((product) => (
                  <Typography key={product.comboProductId}>{`Product ID: ${product.comboProductId}, Quantity: ${product.quantity}`}</Typography>
                ))}
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <CustomSnackbar
          open={alert.isOpen}
          severity={alert.severity}
          message={alert.message}
          onClose={handleCloseAlert}
        />
      </Container>
    </LocalizationProvider>
  );
};

export default CreatePlanView;
