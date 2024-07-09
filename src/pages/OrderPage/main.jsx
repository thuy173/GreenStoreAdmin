import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

import ListOrderView from 'src/sections/order/view/list-order-view';

// ----------------------------------------------------------------------

const OrderPage = () => {
  const { accessToken: currentToken } = useSelector((state) => state.auth);

  if (!currentToken) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Helmet>
        <title>Order | GreenStore</title>
      </Helmet>

      <ListOrderView />
    </>
  );
};

export default OrderPage;
