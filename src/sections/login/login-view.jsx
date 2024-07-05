import { useState } from 'react';
import { useDispatch, useSelector  } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import Logo from '../../components/logo';
import { bgGradient } from '../../theme/css';
import Iconify from '../../components/iconify';
import { login } from '../../redux/actions/authActions';


// ----------------------------------------------------------------------

const LoginView = (props) => {
  const theme = useTheme();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { isLoggedIn } = useSelector(state => state.auth);

  const handleLogin = (e) => {
    e.preventDefault();

    const credentials = { email, password };
    dispatch(login(credentials, navigate));
  };

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleLogin}
      >
        Login
      </Button>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
            gap: 3,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h4" sx={{ textAlign: 'center' }}>Login</Typography>
          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}

export default LoginView;