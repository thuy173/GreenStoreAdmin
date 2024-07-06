import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

import ListNutrientView from 'src/sections/nutrient/view/list-nutrient-view';

// ----------------------------------------------------------------------

const NutrientPage = () => {
  const { accessToken: currentToken } = useSelector((state) => state.auth);

  if (!currentToken) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Helmet>
        <title>Nutrient | GreenStore</title>
      </Helmet>

      <ListNutrientView />
    </>
  );
};

export default NutrientPage;
