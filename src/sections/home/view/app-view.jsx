import { Grid, Stack, Container } from '@mui/material';

import CardDashboard from '../list';

const formatVND = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// ----------------------------------------------------------------------

export default function AppView() {
  return (
    <Container maxWidth="xl">
      <Stack direction="row" spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <CardDashboard
            title="Income"
            total={formatVND(1)}
            color="success"
            icon={<img alt="icon" src="/assets/images/main/ic_income.svg" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <CardDashboard
            title="Product"
            total={1}
            color="info"
            icon={<img alt="icon" src="/assets/images/main/ic_fruit.svg" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <CardDashboard
            title="Customer"
            total={1}
            color="warning"
            icon={<img alt="icon" src="/assets/images/main/ic_customer.svg" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <CardDashboard
            title="Customer"
            total={1}
            color="warning"
            icon={<img alt="icon" src="/assets/images/main/ic_cart.svg" />}
          />
        </Grid>
      </Stack>
    </Container>
  );
}
