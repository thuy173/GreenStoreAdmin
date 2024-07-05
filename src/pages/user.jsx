import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

// import { UserView } from '../sections/user/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  const { accessToken: currentToken } = useSelector((state) => state.auth);

  if (!currentToken) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Helmet>
        <title> User | SkyMath </title>
      </Helmet>

      {/* <UserView /> */}
    </>
  );
}
