import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

import ListBlogView from 'src/sections/blog/view/list-blog-view';

// ----------------------------------------------------------------------

const BlogPage = () => {
  const { accessToken: currentToken } = useSelector((state) => state.auth);

  if (!currentToken) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Helmet>
        <title>Blog | GreenStore</title>
      </Helmet>

      <ListBlogView />
    </>
  );
};

export default BlogPage;
