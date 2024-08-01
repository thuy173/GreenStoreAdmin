import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Button,
  Select,
  TableRow,
  MenuItem,
  TableCell,
  InputLabel,
  FormControl,
} from '@mui/material';

import { emptyRows, applyFilter, getComparator } from 'src/utils/tableUtils';

import ComboServices from 'src/services/ComboServices';

import Link from 'src/components/link';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import TableHead from 'src/components/table/table-head';
import TableNoData from 'src/components/table/table-no-data';
import CustomSnackbar from 'src/components/snackbar/snackbar';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import TableToolbarComponent from 'src/components/table/table-toolbar';

import ListComboRow from '../list-combo-row';

const statusOptions = [
  { value: 'UNDERWEIGHT', label: 'Underweight' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'OVERWEIGHT', label: 'Overweight' },
  { value: 'OBESE', label: 'Obese' },
];

const ListComboView = () => {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState('');
  const filterFields = ['comboName', 'description'];
  const [status, setStatus] = useState('NORMAL');
  const [comboData, setComboData] = useState([]);
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ message: null, severity: 'success', isOpen: false });

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

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: comboData,
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

  const handleOpenAdd = () => {
    navigate('/combo/add');
  };

  const fetchComboData = async () => {
    try {
      const response = await ComboServices.getByBmi(status);
      if (response?.data && response?.status === 200) {
        setComboData(response.data);
      } else {
        console.error(response ?? 'Unexpected response structure');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteRow = async (id) => {
    try {
      const response = await ComboServices.deleteData(id);
      if (response && response.status === 200) {
        showAlert('success', 'Delete combo successfully!');
        fetchComboData();
      } else {
        setAlert({
          message: response?.response?.data?.message || 'An error occurred. Please check again!',
          severity: 'error',
          isOpen: true,
        });
      }
    } catch (error) {
      console.error('Failed to delete combo:', error);
      setAlert({
        message: error.message || 'An error occurred.',
        severity: 'error',
        isOpen: true,
      });
    }
  };

  const handleEditRow = async (id, updatedData) => {
    try {
      const response = await ComboServices.editData(id, updatedData);

      if (response && response.status === 200) {
        showAlert('success', 'Update combo successfully!');
        fetchComboData();
      } else {
        setAlert({
          message: response?.response?.data?.message || 'An error occurred. Please check again!',
          severity: 'error',
          isOpen: true,
        });
      }
    } catch (error) {
      console.error('Failed to edit combo:', error);
      setAlert({
        message: error.message || 'An error occurred.',
        severity: 'error',
        isOpen: true,
      });
    }
  };

  useEffect(() => {
    fetchComboData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    const add = localStorage.getItem('addCombo') === 'true';

    if (add) {
      showAlert('success', 'Add combo successfully!');
      localStorage.removeItem('addCombo');
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
            Combo
          </Typography>
        </Breadcrumbs>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpenAdd}
        >
          Add combo
        </Button>
      </Stack>
      <Stack width="20%" my={3} mx={0.5}>
        <FormControl variant="outlined">
          <InputLabel>Status</InputLabel>
          <Select value={status} onChange={handleStatusChange} label="Status">
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Card sx={{ mt: 1.5 }}>
        <TableToolbarComponent filterValue={filterValue} onFilterChange={handleFilterChange} />
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead
                order={order}
                orderBy={orderBy}
                rowCount={comboData.length}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'comboName', label: 'Combo Name', align: 'center' },
                  { id: 'description', label: 'Description', align: 'center' },
                  { id: 'price', label: 'Price', align: 'center' },
                  { id: 'duration', label: 'Duration', align: 'center' },
                  { id: '' },
                ]}
              />
              {comboData && comboData.length > 0 ? (
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item) => (
                      <ListComboRow
                        key={item.comboId}
                        comboId={item.comboId}
                        comboName={item.comboName}
                        description={item.description}
                        price={item.price}
                        duration={item.duration}
                        onDelete={handleDeleteRow}
                        onEdit={(id, updatedData) => handleEditRow(id, updatedData)}
                      />
                    ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, comboData.length)}
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
            count={comboData.length}
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

export default ListComboView;
