import SvgColor from '../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Shop',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Product',
    icon: icon('ic_applicationUI'),
    iconRight: icon('ic_arrdown'),
    children: [
      {
        title: 'Product',
        path: '/product',
        icon: icon('ic_slide'),
      },
      {
        title: 'News',
        path: '/product',
        icon: icon('ic_news'),
      },
      {
        title: 'News',
        path: '/product',
        icon: icon('ic_partners'),
      },
    ],
  },
  {
    title: 'News',
    path: '/product',
    icon: icon('ic_course'),
  },
];

export default navConfig;
