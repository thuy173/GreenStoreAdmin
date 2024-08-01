import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

import ListComboView from 'src/sections/combo/view/list-combo-view';

// ----------------------------------------------------------------------

const ComboPage = () => {
  const { accessToken: currentToken } = useSelector((state) => state.auth);

  if (!currentToken) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Helmet>
        <title>Combo | GreenStore</title>
      </Helmet>

      <ListComboView />
    </>
  );
};

export default ComboPage;
