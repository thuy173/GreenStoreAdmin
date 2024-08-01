import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useDrag } from 'react-dnd';

const DraggableProduct = ({ product }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PRODUCT',
    item: { ...product },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {`Product ID: ${product.comboProductId}, Quantity: ${product.quantity}`}
    </div>
  );
};

DraggableProduct.propTypes = {
  product: PropTypes.shape({
    comboProductId: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
};

export default DraggableProduct;
