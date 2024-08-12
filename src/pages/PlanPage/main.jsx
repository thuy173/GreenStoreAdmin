import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

import BigCalendar from 'src/sections/plan/view/list-plan-view';

// ----------------------------------------------------------------------

const PlanPage = () => {
  const { accessToken: currentToken } = useSelector((state) => state.auth);

  if (!currentToken) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Helmet>
        <title>Plan | GreenStore</title>
      </Helmet>

      <BigCalendar />
    </>
  );
};

export default PlanPage;
