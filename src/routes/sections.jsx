import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

export const LoadingPage = lazy(() => import('../pages/loading_page'));
export const HomePage = lazy(() => import('../pages/HomePage/app'));
export const LoginPage = lazy(() => import('../pages/login'));
export const Page404 = lazy(() => import('../pages/page-not-found'));
export const DashboardLayout = lazy(() => import('../layouts/dashboard'));
export const ProductPage = lazy(() => import('../pages/ProductPage/main'));
export const AddProductPage = lazy(() => import('../pages/ProductPage/add-product'));
export const CategoryPage = lazy(() => import('../pages/CategoryPage/main'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={<LoadingPage />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <HomePage />, index: true },
        { path: 'product', element: <ProductPage /> },
        { path: 'product/addProduct', element: <AddProductPage /> },
        { path: 'category', element: <CategoryPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
