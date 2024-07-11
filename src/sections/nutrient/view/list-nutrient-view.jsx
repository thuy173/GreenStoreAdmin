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
  DialogTitle,
  DialogContent,
} from '@mui/material';

import { emptyRows, applyFilter, getComparator } from 'src/utils/tableUtils';

import NutrientServices from 'src/services/NutrientServices';

import Link from 'src/components/link';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import TableHead from 'src/components/table/table-head';
import TableNoData from 'src/components/table/table-no-data';
import CustomSnackbar from 'src/components/snackbar/snackbar';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import TableToolbarComponent from 'src/components/table/table-toolbar';

import ListNutrientRow from '../list-nutrient-row';

const ListNutrientView = () => {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState('');
  const filterFields = ['nutrientName', 'description'];
  const [nutrientData, setNutrientData] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [nutrientName, setNutrientName] = useState('');
  const [description, setDescription] = useState('');
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
      const newSelected = nutrientData.map((n) => n.nutrientId);
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
    inputData: nutrientData,
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
    setNutrientName('');
    setDescription('');
  };

  const fetchNutrientData = async () => {
    try {
      const response = await NutrientServices.getAll();
      if (response?.data && response?.status === 200) {
        setNutrientData(response.data);
      } else {
        console.error(response ?? 'Unexpected response structure');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteRow = async (id) => {
    try {
      const response = await NutrientServices.deleteData(id);
      if (response && response.status === 200) {
        showAlert('success', 'Delete nutrient successfully!');
        fetchNutrientData();
      } else {
        setAlert({
          message: response?.response?.data?.message || 'An error occurred. Please check again!',
          severity: 'error',
          isOpen: true,
        });
      }
    } catch (error) {
      console.error('Failed to delete nutrient:', error);
      setAlert({
        message: error.message || 'An error occurred.',
        severity: 'error',
        isOpen: true,
      });
    }
  };

  const handleEditRow = async (id, updatedData) => {
    try {
      const response = await NutrientServices.editData(id, updatedData);

      if (response && response.status === 200) {
        showAlert('success', 'Update nutrient successfully!');
        fetchNutrientData();
      } else {
        setAlert({
          message: response?.response?.data?.message || 'An error occurred. Please check again!',
          severity: 'error',
          isOpen: true,
        });
      }
    } catch (error) {
      console.error('Failed to edit nutrient:', error);
      setAlert({
        message: error.message || 'An error occurred.',
        severity: 'error',
        isOpen: true,
      });
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const credentials = { nutrientName, description };
    try {
      const response = await NutrientServices.addData(credentials);
      if (response.status === 200) {
        handleCloseAddModal();
        showAlert('success', 'Add nutrient successfully!');
        fetchNutrientData();
      } else {
        handleCloseAddModal();
        setAlert({
          message: response?.response?.data?.message || 'An error occurred. Please check again!',
          severity: 'error',
          isOpen: true,
        });
      }
    } catch (error) {
      console.error('Failed to add nutrient:', error);
      setAlert({
        message: error.message || 'An error occurred.',
        severity: 'error',
        isOpen: true,
      });
      handleCloseAddModal();
    }
  };

  useEffect(() => {
    fetchNutrientData();
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
            Nutrient
          </Typography>
        </Breadcrumbs>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpenAddModal}
        >
          Add nutrient
        </Button>
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
                rowCount={nutrientData.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'nutrientName', label: 'Nutrient Name', align: 'center' },
                  { id: 'description', label: 'Description', align: 'center' },
                  { id: '' },
                ]}
              />
              {nutrientData && nutrientData.length > 0 ? (
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item) => (
                      <ListNutrientRow
                        key={item.nutrientId}
                        nutrientId={item.nutrientId}
                        nutrientName={item.nutrientName}
                        description={item.description}
                        selected={selected.indexOf(item.nutrientId) !== -1}
                        handleClick={(event) => handleClick(event, item.nutrientId)}
                        onDelete={handleDeleteRow}
                        onEdit={(id, updatedData) => handleEditRow(id, updatedData)}
                      />
                    ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, nutrientData.length)}
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
            count={nutrientData.length}
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
        <DialogTitle>Add Nutrient new</DialogTitle>
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
          <TextField
            margin="dense"
            fullWidth
            label="Nutrient name"
            variant="outlined"
            name="nutrientName"
            value={nutrientName}
            onChange={(e) => setNutrientName(e.target.value)}
          />
          <TextField
            margin="dense"
            fullWidth
            label="Description"
            variant="outlined"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
          />

          <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              type="submit"
              onClick={handleAdd}
              sx={{ px: 10 }}
            >
              Add nutrient
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default ListNutrientView;
