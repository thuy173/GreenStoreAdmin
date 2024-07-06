import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

import EditProductView from 'src/sections/product/view/edit-product-view';

// ----------------------------------------------------------------------

const EditProductPage = () => {
  const { accessToken: currentToken } = useSelector((state) => state.auth);

  if (!currentToken) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Helmet>
        <title>Edit Product | GreenStore</title>
      </Helmet>

      <EditProductView />
    </>
  );
};

export default EditProductPage;
