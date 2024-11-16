import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import useDebounce from "./useDebounce";

const ContactTable = ({ onAdd }) => {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ field: "createdAt", order: "desc" }); // Default to createdAt and desc
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [openSortDialog, setOpenSortDialog] = useState(false);
  const [selectedSortField, setSelectedSortField] = useState("createdAt");
  const [selectedOrder, setSelectedOrder] = useState("desc");
  const debouncedSearch = useDebounce(search, 300);

  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/contacts", {
        params: {
          q: debouncedSearch,
          sort: sort.field,
          order: sort.order,
          page,
          limit: rowsPerPage,
        },
      });
      setContacts(response.data.contacts);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [debouncedSearch, sort, page, rowsPerPage]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/contacts/${id}`);
      fetchContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleSort = () => {
    setSort({ field: selectedSortField, order: selectedOrder });
    setOpenSortDialog(false);
    setPage(1); // Reset to the first page when sort changes
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(e.target.value);
    setPage(1); // Reset to the first page when rows per page changes
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between gap-4 items-center">
        <TextField
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
          size="small"
        />
        <div className="flex gap-4">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenSortDialog(true)}
          size="small"
        >
          Sort By
        </Button>
        <FormControl>
          <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
          <Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            style={{ width: 120 }}
            label="Rows per page"
            labelId="rows-per-page-label"
            size="small"
          >
            {[5, 10, 20, 50].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={onAdd}>
          Add Contact
        </Button>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              {["First Name", "Last Name", "Email", "Phone", "Company", "Job Title", "Actions"].map((header) => (
                <TableCell key={header}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact._id}>
                <TableCell>{contact.firstName}</TableCell>
                <TableCell>{contact.lastName}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{contact.company}</TableCell>
                <TableCell>{contact.jobTitle}</TableCell>
                <TableCell>
                  <Button color="secondary" onClick={() => handleDelete(contact._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>

      {/* Sort Dialog */}
      <Dialog open={openSortDialog} onClose={() => setOpenSortDialog(false)}>
        <DialogTitle>Sort Contacts</DialogTitle>
        <DialogContent>
          <div className="mt-4">
            <FormControl fullWidth>
              <InputLabel id="sort2" >Sort By</InputLabel>
              <Select
                value={selectedSortField}
                onChange={(e) => setSelectedSortField(e.target.value)}
                labelId="sort2"
                label="Sort By"
              >
                {["createdAt", "firstName", "lastName", "email", "phone", "company", "jobTitle"].map((field) => (
                  <MenuItem key={field} value={field}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth style={{ marginTop: "16px" }}>
              <InputLabel id="order">Order</InputLabel>
              <Select
                value={selectedOrder}
                onChange={(e) => setSelectedOrder(e.target.value)}
                labelId="order"
                label="Order"
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSortDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSort} color="primary">
            Apply Sort
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ContactTable;
