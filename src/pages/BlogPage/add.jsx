import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

import CreateBlog from 'src/sections/blog/view/add-blog';

// ----------------------------------------------------------------------

const CreateBlogPage = () => {
  const { accessToken: currentToken } = useSelector((state) => state.auth);

  if (!currentToken) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Helmet>
        <title>Create blog | GreenStore</title>
      </Helmet>

      <CreateBlog />
    </>
  );
};

export default CreateBlogPage;
