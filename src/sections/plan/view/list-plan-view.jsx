/* eslint-disable import/no-extraneous-dependencies */
import moment from 'moment';
import React, { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';

import { Card, Container, CardContent } from '@mui/material';

import CustomSnackbar from 'src/components/snackbar/snackbar';

import AddPlanDialog from '../plan-dialog';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  const [calevents] = useState();
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({ message: null, severity: 'success', isOpen: false });

  const handleCloseAlert = () => {
    setAlert({ message: null, severity: 'success', isOpen: false });
  };

  const addNewPlanAlert = (slotInfo) => {
    setOpen(true);
  };

  const eventColors = (event) => {
    if (event.color) {
      return { className: `event-${event.color}` };
    }

    return { className: `event-default` };
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Card>
        <CardContent>
          <Calendar
            selectable
            events={calevents}
            defaultView="month"
            scrollToTime={new Date(1970, 1, 1, 6)}
            defaultDate={new Date()}
            localizer={localizer}
            style={{ height: 'calc(100vh - 100px' }}
            onSelectSlot={(slotInfo) => addNewPlanAlert(slotInfo)}
            eventPropGetter={(event) => eventColors(event)}
          />
        </CardContent>
      </Card>
      <AddPlanDialog open={open} handleClose={handleClose} />

      <CustomSnackbar
        open={alert.isOpen}
        onClose={handleCloseAlert}
        message={alert.message}
        severity={alert.severity}
      />
    </Container>
  );
};

export default BigCalendar;
