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
} from "@mui/material";
import useDebounce from "./useDebounce";
import SortDialog from "./SortDialog";
import AddContactDialog from "./AddContactDialog";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit"

const ContactTable = () => {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ field: "createdAt", order: "desc" });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [openSortDialog, setOpenSortDialog] = useState(false);
  const [selectedSortField, setSelectedSortField] = useState("createdAt");
  const [selectedOrder, setSelectedOrder] = useState("desc");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
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
    setPage(1);
  };

  const handleEdit = (contact) => {
    setSelectedContact(contact);
    setOpenEditDialog(true);
  };

  return (
    <div className="p-4 h-screen">
      <div className="mb-4 flex justify-between gap-4 items-center">
        <TextField
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
          size="small"
        />
        <div className="flex gap-4">
          <Button variant="contained" color="primary" onClick={() => setOpenSortDialog(true)} size="small">
            Sort By
          </Button>
          <FormControl>
            <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
            <Select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(e.target.value)}
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
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenEditDialog(true)}
          >
            Add Contact
          </Button>
        </div>
      </div>
      <div className="h-[85%] overflow-x-scroll">
        <Table>
          <TableHead>
            <TableRow>
              {[
                { label: "First Name", width: "15%" },
                { label: "Last Name", width: "15%" },
                { label: "Email", width: "25%" },
                { label: "Phone", width: "15%" },
                { label: "Company", width: "15%" },
                { label: "Job Title", width: "10%" },
                { label: "Actions", width: "5%" },
              ].map((header) => (
                <TableCell
                  key={header.label}
                  sx={{ width: header.width, fontWeight: "bold" }}
                >
                  {header.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody className="overflow-x-scroll h-full">
            {contacts.map((contact) => (
              <TableRow key={contact._id}>
                <TableCell sx={{ width: "15%" }}>{contact.firstName}</TableCell>
                <TableCell sx={{ width: "15%" }}>{contact.lastName}</TableCell>
                <TableCell sx={{ width: "25%" }}>{contact.email}</TableCell>
                <TableCell sx={{ width: "15%" }}>{contact.phone}</TableCell>
                <TableCell sx={{ width: "15%" }}>{contact.company}</TableCell>
                <TableCell sx={{ width: "10%" }}>{contact.jobTitle}</TableCell>
                <TableCell sx={{ width: "5%" }}>
                  <div className="flex">
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(contact._id)}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(contact)}
                    aria-label="edit"
                  >
                    <EditIcon />
                  </IconButton>
                  </div>
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
          onChange={(_, newPage) => setPage(newPage)}
          color="primary"
        />
      </div>
      <SortDialog
        open={openSortDialog}
        onClose={() => setOpenSortDialog(false)}
        onApply={handleSort}
        selectedSortField={selectedSortField}
        setSelectedSortField={setSelectedSortField}
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
      />
      
      <AddContactDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onRefresh={fetchContacts}
        initialData={selectedContact}
      />
    </div>
  );
};

export default ContactTable;
