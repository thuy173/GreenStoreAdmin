import React from 'react';
import PropTypes from 'prop-types';

import { Fab } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ColorPicker = ({ colors, selectedColor, onColorSelect }) => (
    <>
      {colors.map((colorOption) => (
        <Fab
          key={colorOption.id}
          color="primary"
          style={{ backgroundColor: colorOption.eColor }}
          sx={{
            marginRight: '3px',
            transition: '0.1s ease-in',
            scale: colorOption.value === selectedColor ? '0.9' : '0.7',
          }}
          size="small"
          onClick={() => onColorSelect(colorOption.value)}
        >
          {colorOption.value === selectedColor && <CheckCircleIcon width={16} />}
        </Fab>
      ))}
    </>
  );

ColorPicker.propTypes = {
  colors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      eColor: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedColor: PropTypes.string.isRequired,
  onColorSelect: PropTypes.func.isRequired,
};

export default ColorPicker;
