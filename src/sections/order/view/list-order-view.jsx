import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { TableRow, TableCell } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { emptyRows, applyFilter, getComparator } from 'src/utils/tableUtils';

import OrderServices from 'src/services/OrderServices';
import ProductServices from 'src/services/ProductServices';

import Link from 'src/components/link';
import Scrollbar from 'src/components/scrollbar';
import TableHead from 'src/components/table/table-head';
import TableNoData from 'src/components/table/table-no-data';
import CustomSnackbar from 'src/components/snackbar/snackbar';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import TableToolbarComponent from 'src/components/table/table-toolbar';

import ListOrderRow from '../list-order-row';

const ListOrderView = () => {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState('');
  const filterFields = ['guestName', 'shippingAddress'];
  const [orderData, setOrderData] = useState([]);
  const [alert, setAlert] = useState({ message: null, severity: 'success', isOpen: false });

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = orderData.map((n) => n.orderId);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const dataFiltered = applyFilter({
    inputData: orderData,
    comparator: getComparator(order, orderBy),
    filterValue,
    filterFields,
  });

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const notFound = !dataFiltered.length;

  const showAlert = (severity, message) => {
    setAlert({ severity, message, isOpen: true });
  };

  const handleCloseAlert = () => {
    setAlert({ message: null, severity: 'success', isOpen: false });
  };

  const fetchOrderData = async () => {
    try {
      const response = await OrderServices.getAll();
      if (response?.data && response?.status === 200) {
        setOrderData(response.data);
      } else {
        console.error(response ?? 'Unexpected response structure');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleHideRow = async (id) => {
    try {
      const response = await ProductServices.hideData(id);
      if (response && response.status === 204) {
        showAlert('success', 'Hidden product successfully!');
        fetchOrderData();
      } else {
        setAlert({
          message: response?.response?.data?.message || 'An error occurred. Please check again!',
          severity: 'error',
          isOpen: true,
        });
      }
    } catch (error) {
      console.error('Failed to hide product:', error);
      setAlert({
        message: error.message || 'An error occurred.',
        severity: 'error',
        isOpen: true,
      });
    }
  };
  const handleShow = async (id) => {
    try {
      const response = await ProductServices.showData(id);
      if (response && response.status === 204) {
        showAlert('success', 'Show product successfully!');
        fetchOrderData();
      } else {
        setAlert({
          message: response?.response?.data?.message || 'An error occurred. Please check again!',
          severity: 'error',
          isOpen: true,
        });
      }
    } catch (error) {
      console.error('Failed to show product:', error);
      setAlert({
        message: error.message || 'An error occurred.',
        severity: 'error',
        isOpen: true,
      });
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  useEffect(() => {
    const update = localStorage.getItem('updateProduct') === 'true';
    const add = localStorage.getItem('addProduct') === 'true';
    const change = localStorage.getItem('changeImageProduct') === 'true';

    if (update) {
      showAlert('success', 'Update product successfully!');
      localStorage.removeItem('updateProduct');
    }
    if (add) {
      showAlert('success', 'Add product successfully!');
      localStorage.removeItem('addProduct');
    }
    if (change) {
      showAlert('success', 'Change images successfully!');
      localStorage.removeItem('changeImageProduct');
    }
  }, []);
  return (
    <Stack px={3}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Breadcrumbs separator={<NavigateNextIcon fontSize="large" />} aria-label="breadcrumb">
          <Link href="/">
            <Stack direction="row" alignItems="center">
              <Typography variant="body1">Dashboard</Typography>
            </Stack>
          </Link>
          <Typography variant="body1" color="text.primary">
            Order
          </Typography>
        </Breadcrumbs>
      </Stack>

      <Card sx={{ mt: 1.5 }}>
        <TableToolbarComponent
          numSelected={selected.length}
          filterValue={filterValue}
          onFilterChange={handleFilterChange}
        />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead
                order={order}
                orderBy={orderBy}
                rowCount={orderData.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'customerId', label: 'CustomerId', align: 'center' },
                  { id: 'guestName', label: 'Name', align: 'center' },
                  { id: 'totalAmount', label: 'Amount', align: 'center' },
                  { id: 'shippingAddress', label: 'Shipping Address', align: 'center' },
                  { id: 'status', label: 'Status', align: 'center' },
                  { id: '' },
                ]}
              />
              {orderData && orderData.length > 0 ? (
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item) => (
                      <ListOrderRow
                        key={item.orderId}
                        orderId={item.orderId}
                        customerId={item.customerId}
                        totalAmount={item.totalAmount}
                        guestName={item.guestName}
                        shippingAddress={item.shippingAddress}
                        status={item.status}
                        selected={selected.indexOf(item.orderId) !== -1}
                        handleClick={(event) => handleClick(event, item.orderId)}
                        onHide={handleHideRow}
                        onShow={handleShow}
                      />
                    ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, orderData.length)}
                  />

                  {notFound && <TableNoData />}
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={7}>
                      <Typography variant="h6" gutterBottom component="div" sx={{ m: 4 }}>
                        No data
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
          <TablePagination
            page={page}
            component="div"
            count={orderData.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Scrollbar>
      </Card>

      <CustomSnackbar
        open={alert.isOpen}
        onClose={handleCloseAlert}
        message={alert.message}
        severity={alert.severity}
      />
    </Stack>
  );
};

export default ListOrderView;
