import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

import UpdateBlogView from 'src/sections/blog/view/update-blog-view';

// ----------------------------------------------------------------------

const UpdateBlogPage = () => {
  const { accessToken: currentToken } = useSelector((state) => state.auth);

  if (!currentToken) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Helmet>
        <title>Update blog | GreenStore</title>
      </Helmet>

      <UpdateBlogView />
    </>
  );
};

export default UpdateBlogPage;
