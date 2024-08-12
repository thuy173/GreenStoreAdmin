/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ calevents, addNewPlanAlert, eventColors }) => (
    <Calendar
      selectable
      events={calevents}
      defaultView="month"
      scrollToTime={new Date(1970, 1, 1, 6)}
      defaultDate={new Date()}
      localizer={localizer}
      style={{ height: 'calc(100vh - 100px)' }}
      onSelectSlot={(slotInfo) => addNewPlanAlert(slotInfo)}
      eventPropGetter={(event) => eventColors(event)}
    />
  );

CalendarComponent.propTypes = {
  calevents: PropTypes.array.isRequired,
  addNewPlanAlert: PropTypes.func.isRequired,
  eventColors: PropTypes.func.isRequired,
};

export default CalendarComponent;
