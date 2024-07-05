import { Stack } from '@mui/material';

import News from '../news';
import About from '../about';
import Banner from '../banner';
import ListMenu from '../list';

// ----------------------------------------------------------------------

export default function AppView() {
  return (
    <Stack sx={{ marginBottom: -10 }}>
      <Banner />
      <ListMenu />
      <About/>
      <News />
    </Stack>
  );
}
