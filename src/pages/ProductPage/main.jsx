import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

import ListProductView from 'src/sections/product/view/list-product-view';

// ----------------------------------------------------------------------

const ProductPage = () => {
  const { accessToken: currentToken } = useSelector((state) => state.auth);

  if (!currentToken) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Helmet>
        <title>Product | GreenStore</title>
      </Helmet>

      <ListProductView />
    </>
  );
};

export default ProductPage;
