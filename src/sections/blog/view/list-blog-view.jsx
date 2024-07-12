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

import BlogServices from 'src/services/BlogServices';

import Link from 'src/components/link';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import TableHead from 'src/components/table/table-head';
import TableNoData from 'src/components/table/table-no-data';
import CustomSnackbar from 'src/components/snackbar/snackbar';
import TableEmptyRows from 'src/components/table/table-empty-rows';
import TableToolbarComponent from 'src/components/table/table-toolbar';

import ListBlogRow from '../list-blog-row';

const ListBlogView = () => {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState('');
  const filterFields = ['title', 'description'];
  const [blogData, setBlogData] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
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

  const dataFiltered = applyFilter({
    inputData: blogData,
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
    setCategoryName('');
    setDescription('');
  };

  const fetchBlogData = async () => {
    try {
      const response = await BlogServices.getAll();
      if (response?.data && response?.status === 200) {
        setBlogData(response.data);
      } else {
        console.error(response ?? 'Unexpected response structure');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEditRow = async (id, updatedData) => {
    try {
      const response = await BlogServices.editData(id, updatedData);

      if (response && response.status === 200) {
        showAlert('success', 'Update category successfully!');
        fetchBlogData();
      } else {
        setAlert({
          message: response?.response?.data?.message || 'An error occurred. Please check again!',
          severity: 'error',
          isOpen: true,
        });
      }
    } catch (error) {
      console.error('Failed to edit category:', error);
      setAlert({
        message: error.message || 'An error occurred.',
        severity: 'error',
        isOpen: true,
      });
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const credentials = { categoryName, description };
    try {
      const response = await BlogServices.addData(credentials);
      if (response.status === 200) {
        handleCloseAddModal();
        showAlert('success', 'Add category successfully!');
        fetchBlogData();
      } else {
        handleCloseAddModal();
        setAlert({
          message: response?.response?.data?.message || 'An error occurred. Please check again!',
          severity: 'error',
          isOpen: true,
        });
      }
    } catch (error) {
      console.error('Failed to add category:', error);
      setAlert({
        message: error.message || 'An error occurred.',
        severity: 'error',
        isOpen: true,
      });
      handleCloseAddModal();
    }
  };

  useEffect(() => {
    fetchBlogData();
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
            Blog
          </Typography>
        </Breadcrumbs>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpenAddModal}
        >
          Add blog
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
                rowCount={blogData.length}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'thumbnail', label: ' ', align: 'center' },
                  { id: 'title', label: 'Title', align: 'center' },
                  { id: 'description', label: 'Description', align: 'center' },
                  { id: 'createAt', label: 'CreateAt', align: 'center' },
                  { id: 'approved', label: 'Approved', align: 'center' },
                  { id: '' },
                ]}
              />
              {blogData && blogData.length > 0 ? (
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item) => (
                      <ListBlogRow
                        key={item.blogId}
                        blogId={item.blogId}
                        title={item.title}
                        thumbnail={item.thumbnail}
                        createAt={item.createAt}
                        approved={item.approved}
                        description={item.description}
                        onEdit={(id, updatedData) => handleEditRow(id, updatedData)}
                      />
                    ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, blogData.length)}
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
            count={blogData.length}
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
        <DialogTitle>Add category new</DialogTitle>
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
            label="Category name"
            variant="outlined"
            name="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
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
              Add category
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default ListBlogView;
