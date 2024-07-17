import SvgColor from '../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic_dashboard'),
  },
  {
    title: 'Category',
    path: '/category',
    icon: icon('ic_category'),
  },
  {
    title: 'Nutrient',
    path: '/nutrient',
    icon: icon('ic_nutrient'),
  },
  {
    title: 'Product',
    path: '/product',
    icon: icon('ic_fruit'),
  },
  {
    title: 'Order',
    path: '/order',
    icon: icon('ic_order'),
  },
  {
    title: 'Customer',
    path: '/customer',
    icon: icon('ic_user'),
  },
  {
    title: 'Blog',
    path: '/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'Voucher',
    path: '/voucher',
    icon: icon('ic_blog'),
  },
];

export default navConfig;
