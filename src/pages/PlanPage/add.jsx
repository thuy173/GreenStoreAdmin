import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

import CreatePlanView from 'src/sections/plan/view/add-plan';

// ----------------------------------------------------------------------

const CreatePlanPage = () => {
  const { accessToken: currentToken } = useSelector((state) => state.auth);

  if (!currentToken) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Helmet>
        <title>Create plan | GreenStore</title>
      </Helmet>

      <CreatePlanView />
    </>
  );
};

export default CreatePlanPage;
