import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

import ListCustomerView from 'src/sections/customer/view/list-customer-view';

// ----------------------------------------------------------------------

const CustomerPage = () => {
  const { accessToken: currentToken } = useSelector((state) => state.auth);

  if (!currentToken) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Helmet>
        <title>Customer | GreenStore</title>
      </Helmet>

      <ListCustomerView />
    </>
  );
};

export default CustomerPage;
