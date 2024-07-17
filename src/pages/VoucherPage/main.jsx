import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

import ListVoucherView from 'src/sections/voucher/view/list-voucher-view';

// ----------------------------------------------------------------------

const VoucherPage = () => {
  const { accessToken: currentToken } = useSelector((state) => state.auth);

  if (!currentToken) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Helmet>
        <title>Voucher | GreenStore</title>
      </Helmet>

      <ListVoucherView />
    </>
  );
};

export default VoucherPage;
