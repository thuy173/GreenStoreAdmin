import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

import AddComboView from 'src/sections/combo/view/add-combo';

// ----------------------------------------------------------------------

const AddComboPage = () => {
  const { accessToken: currentToken } = useSelector((state) => state.auth);

  if (!currentToken) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Helmet>
        <title>Add combo | GreenStore</title>
      </Helmet>

      <AddComboView />
    </>
  );
};

export default AddComboPage;
