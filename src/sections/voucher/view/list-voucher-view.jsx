import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Box,
  Button,
  Dialog,
  TableRow,
  TableCell,
  TextField,
  IconButton,
  InputLabel,
  DialogTitle,
  FormControl,
  DialogContent,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';

import { emptyRows, applyFilter, getComparator } from 'src/utils/tableUtils';

import VoucherServices from 'src/services/VoucherServices';

import Link from 'src/components/link';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import TableHead from 'src/components/table/table-head';
import TableNoData from 'src/components/table/table-no-data';
import CustomSnackbar from 'src/components/snackbar/snackbar';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import TableToolbarComponent from 'src/components/table/table-toolbar';

import ListVoucherRow from '../list-voucher-row';

function formatTime(date) {
  const years = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = '00';
  const milliseconds = '000';

  return `${years}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}

const ListVoucherView = () => {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState('');
  const filterFields = ['code', 'discount'];
  const [voucherData, setVoucherData] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [discount, setDiscount] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [alert, setAlert] = useState({ message: null, severity: 'success', isOpen: false });
  const [expiryDate, setExpiryDate] = useState();

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const dataFiltered = applyFilter({
    inputData: voucherData,
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

  const handleOpenAddModal = () => setOpenAdd(true);

  const handleCloseAddModal = () => {
    setOpenAdd(false);
    setDiscount('');
    setMinOrderAmount('');
  };

  const fetchVoucherData = async () => {
    try {
      const response = await VoucherServices.getAll();
      if (response?.data && response?.status === 200) {
        setVoucherData(response.data);
      } else {
        console.error(response ?? 'Unexpected response structure');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteRow = async (id) => {
    try {
      const response = await VoucherServices.deleteData(id);
      if (response && response.status === 200) {
        showAlert('success', 'Delete voucher successfully!');
        fetchVoucherData();
      } else {
        setAlert({
          message: response?.response?.data?.message || 'An error occurred. Please check again!',
          severity: 'error',
          isOpen: true,
        });
      }
    } catch (error) {
      console.error('Failed to delete voucher:', error);
      setAlert({
        message: error.message || 'An error occurred.',
        severity: 'error',
        isOpen: true,
      });
    }
  };

  const handleEditRow = async (id, updatedData) => {
    try {
      const response = await VoucherServices.editData(id, updatedData);

      if (response && response.status === 200) {
        showAlert('success', 'Update voucher successfully!');
        fetchVoucherData();
      } else {
        setAlert({
          message: response?.response?.data?.message || 'An error occurred. Please check again!',
          severity: 'error',
          isOpen: true,
        });
      }
    } catch (error) {
      console.error('Failed to edit voucher:', error);
      setAlert({
        message: error.message || 'An error occurred.',
        severity: 'error',
        isOpen: true,
      });
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const formattedExpiryDate = expiryDate ? new Date(expiryDate) : null;

    const credentials = { discount, minOrderAmount, expiryDate: formatTime(formattedExpiryDate) };
    try {
      const response = await VoucherServices.addData(credentials);
      if (response.status === 200) {
        handleCloseAddModal();
        showAlert('success', 'Add voucher successfully!');
        fetchVoucherData();
      } else {
        handleCloseAddModal();
        setAlert({
          message: response?.response?.data?.message || 'An error occurred. Please check again!',
          severity: 'error',
          isOpen: true,
        });
      }
    } catch (error) {
      console.error('Failed to add voucher:', error);
      setAlert({
        message: error.message || 'An error occurred.',
        severity: 'error',
        isOpen: true,
      });
      handleCloseAddModal();
    }
  };

  useEffect(() => {
    fetchVoucherData();
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
            Voucher
          </Typography>
        </Breadcrumbs>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpenAddModal}
        >
          Add voucher
        </Button>
      </Stack>

      <Card sx={{ mt: 1.5 }}>
        <TableToolbarComponent filterValue={filterValue} onFilterChange={handleFilterChange} />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead
                order={order}
                orderBy={orderBy}
                rowCount={voucherData.length}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'code', label: 'Code', align: 'center' },
                  { id: 'discount', label: 'Discount', align: 'center' },
                  { id: 'minOrderAmount', label: 'Min order amount', align: 'center' },
                  { id: 'expiryDate', label: 'Expiry Date', align: 'center' },
                  { id: '' },
                ]}
              />
              {voucherData && voucherData.length > 0 ? (
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item) => (
                      <ListVoucherRow
                        key={item.voucherId}
                        voucherId={item.voucherId}
                        code={item.code}
                        discount={item.discount}
                        minOrderAmount={item.minOrderAmount}
                        expiryDate={item.expiryDate}
                        onDelete={handleDeleteRow}
                        onEdit={(id, updatedData) => handleEditRow(id, updatedData)}
                      />
                    ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, voucherData.length)}
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
            count={voucherData.length}
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

      <Dialog open={openAdd} onClose={handleCloseAddModal} fullWidth maxWidth="md">
        <DialogTitle>Add voucher new</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseAddModal}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Stack direction="row" spacing={2}>
            <FormControl sx={{ mt: 1, width: '50%' }} variant="outlined">
              <InputLabel htmlFor="outlined-discount">Discount</InputLabel>
              <OutlinedInput
                id="discount"
                label="Discount"
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                aria-describedby="discount"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                name="discount"
              />
            </FormControl>
            <FormControl sx={{ mt: 1, width: '50%' }} variant="outlined">
              <InputLabel htmlFor="outlined-discount">Min Order Amount</InputLabel>
              <OutlinedInput
                id="minOrderAmount"
                label="Min Order Amount"
                endAdornment={<InputAdornment position="end">$</InputAdornment>}
                aria-describedby="minOrderAmount"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value)}
                name="minOrderAmount"
              />
            </FormControl>
          </Stack>
          <Stack sx={{ width: '100%', mt: 2 }}>
            <Typography>Expiry Date</Typography>
            <TextField
              variant="outlined"
              type="datetime-local"
              onChange={(e) => {
                setExpiryDate(e.target.value);
              }}
              name="expiryDate"
              sx={{ width: '100%' }}
            />
          </Stack>
          <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              type="submit"
              onClick={handleAdd}
              sx={{ px: 10 }}
            >
              Add voucher
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default ListVoucherView;
