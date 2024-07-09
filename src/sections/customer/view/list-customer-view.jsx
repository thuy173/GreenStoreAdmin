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

import ProductServices from 'src/services/ProductServices';
import CustomerServices from 'src/services/CustomerServices';

import Link from 'src/components/link';
import Scrollbar from 'src/components/scrollbar';
import TableHead from 'src/components/table/table-head';
import TableNoData from 'src/components/table/table-no-data';
import CustomSnackbar from 'src/components/snackbar/snackbar';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import TableToolbarComponent from 'src/components/table/table-toolbar';

import ListCustomerRow from '../list-customer-row';

const ListCustomerView = () => {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState('');
  const filterFields = ['fullName', 'email', 'phoneNumber'];
  const [customerData, setCustomerData] = useState([]);
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
      const newSelected = customerData.map((n) => n.customerId);
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
    inputData: customerData,
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

  const fetchCustomerData = async () => {
    try {
      const response = await CustomerServices.getAll();
      if (response?.data && response?.status === 200) {
        setCustomerData(response.data);
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
        fetchCustomerData();
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
        fetchCustomerData();
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
    fetchCustomerData();
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
    <Stack p={5}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Breadcrumbs separator={<NavigateNextIcon fontSize="large" />} aria-label="breadcrumb">
          <Link href="/">
            <Stack direction="row" alignItems="center">
              <Typography variant="body1">Dashboard</Typography>
            </Stack>
          </Link>
          <Typography variant="body1" color="text.primary">
            Customer
          </Typography>
        </Breadcrumbs>
      </Stack>

      <Card sx={{ mt: 5 }}>
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
                rowCount={customerData.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  // { id: 'productImages', label: '', align: 'center' },
                  { id: 'fullName', label: 'Full Name', align: 'center' },
                  { id: 'email', label: 'Email', align: 'center' },
                  { id: 'phoneNumber', label: 'Phone number', align: 'center' },
                  { id: 'address', label: 'Address', align: 'center' },
                  { id: '' },
                ]}
              />
              {customerData && customerData.length > 0 ? (
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item, index) => (
                      <ListCustomerRow
                        key={item.customerId}
                        index={index + 1}
                        customerId={item.customerId}
                        fullName={item.fullName}
                        email={item.email}
                        phoneNumber={item.phoneNumber}
                        address={item.address}
                        selected={selected.indexOf(item.customerId) !== -1}
                        handleClick={(event) => handleClick(event, item.customerId)}
                        onHide={handleHideRow}
                        onShow={handleShow}
                      />
                    ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, customerData.length)}
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
            count={customerData.length}
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

export default ListCustomerView;
