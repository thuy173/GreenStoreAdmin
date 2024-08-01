import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useDrop } from 'react-dnd';

import { Typography } from '@mui/material';

const DroppableSchedule = ({ schedule, onDropProduct }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'PRODUCT',
    drop: (item) => onDropProduct(schedule.date, item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} style={{ backgroundColor: isOver ? '#f0f0f0' : '#fff' }}>
      <Typography variant="h6">{`Date: ${schedule.date}`}</Typography>
      {schedule.scheduledProducts.map((product, index) => (
        <div key={index}>
          {`Product ID: ${product.comboProductId}, Quantity: ${product.quantity}`}
        </div>
      ))}
    </div>
  );
};

DroppableSchedule.propTypes = {
  schedule: PropTypes.shape({
    date: PropTypes.string.isRequired,
    scheduledProducts: PropTypes.arrayOf(
      PropTypes.shape({
        comboProductId: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onDropProduct: PropTypes.func.isRequired,
};

export default DroppableSchedule;
