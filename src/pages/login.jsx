import { Helmet } from 'react-helmet-async';

import { LoginView } from '../sections/login';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Login | SkyMath </title>
      </Helmet>

      <LoginView />
    </>
  );
}
