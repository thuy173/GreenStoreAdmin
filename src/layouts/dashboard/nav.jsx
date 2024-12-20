import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

import { NAV } from './config-layout';
// import Logo from '../../components/logo';
import navConfig from './config-navigation';
import { usePathname } from '../../routes/hooks';
import Scrollbar from '../../components/scrollbar';
import { RouterLink } from '../../routes/components';
import { useResponsive } from '../../components/hooks/use-responsive';

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {
  const pathname = usePathname();

  const upLg = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderAccount = (
    <Box
      sx={{
        my: 2,
        mx: 2.5,
        py: 1.3,
        px: 2.5,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Avatar
        src=""
        alt=""
        sx={{
          width: 36,
          height: 36,
          border: (theme) => `solid 2px ${theme.palette.background.default}`,
        }}
      />

      <Typography variant="subtitle2" sx={{ my: 1.5, px: 1.5 }}>
        Admin
      </Typography>
    </Box>
  );

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 3.8 }}>
      {navConfig.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </Stack>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* <Logo sx={{ mt: 3, ml: 4 }} /> */}
      <Stack justifyContent="center" alignItems="center">
        <Typography sx={{ mt: 3, color: '#507c5c' }} variant="h4">
          Green Store
        </Typography>
      </Stack>

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------
function NavItem({ item }) {
  const pathname = usePathname();
  const active = item.path === pathname;

  const [openMenu, setOpenMenu] = useState(false);
  const handleClick = () => setOpenMenu(!openMenu);

  return (
    <>
      <ListItemButton
        onClick={item.children ? handleClick : undefined}
        component={RouterLink}
        href={item.path}
        sx={{
          minHeight: 44,
          borderRadius: 0.75,
          typography: 'body2',
          color: 'text.secondary',
          textTransform: 'capitalize',
          fontWeight: 'fontWeightMedium',
          ...(active && {
            color: '#3b413a',
            fontWeight: 'fontWeightSemiBold',
            bgcolor: '#edeff1',
            '&:hover': {
              bgcolor: '#edeff1',
            },
          }),
        }}
      >
        <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
          {item.icon}
        </Box>

        <Box component="span">{item.title}</Box>

        {item.children && (
          <Box component="span" sx={{ width: 20, height: 24, ml: 7 }}>
            {item.iconRight}
          </Box>
        )}
      </ListItemButton>

      {openMenu && item.children && (
        <Stack>
          {item.children.map((child) => (
            <ListItemButton
              key={child.title}
              component={RouterLink}
              href={child.path}
              sx={{
                marginLeft: 2,
                minHeight: 44,
                borderRadius: 0.75,
                typography: 'body2',
                color: 'text.secondary',
                textTransform: 'capitalize',
                fontWeight: 'fontWeightMedium',
                ...(child.path === pathname && {
                  color: '#3b413a',
                  fontWeight: 'fontWeightSemiBold',
                  bgcolor: '#edeff1',
                  '&:hover': {
                    bgcolor: '#edeff1',
                  },
                }),
              }}
            >
              <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
                {child.icon}
              </Box>

              <Box component="span">{child.title}</Box>
            </ListItemButton>
          ))}
        </Stack>
      )}
    </>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};
