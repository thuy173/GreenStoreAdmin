import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

import ListCategoryView from 'src/sections/category/view/list-category-view';

// ----------------------------------------------------------------------

const CategoryPage = () => {
  const { accessToken: currentToken } = useSelector((state) => state.auth);

  if (!currentToken) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Helmet>
        <title>Category | GreenStore</title>
      </Helmet>

      <ListCategoryView />
    </>
  );
};

export default CategoryPage;
