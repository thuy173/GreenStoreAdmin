import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

import AddProductView from 'src/sections/product/view/add-product';

// ----------------------------------------------------------------------

const AddProductPage = () => {
  const { accessToken: currentToken } = useSelector((state) => state.auth);

  if (!currentToken) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Helmet>
        <title>Add Product | GreenStore</title>
      </Helmet>

      <AddProductView />
    </>
  );
};

export default AddProductPage;
