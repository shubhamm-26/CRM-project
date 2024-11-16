import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const SortDialog = ({ open, onClose, onApply, selectedSortField, setSelectedSortField, selectedOrder, setSelectedOrder }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Sort Contacts</DialogTitle>
    <DialogContent>
      <div className="mt-4">
        <FormControl fullWidth>
          <InputLabel id="sort-field-label">Sort By</InputLabel>
          <Select
            value={selectedSortField}
            onChange={(e) => setSelectedSortField(e.target.value)}
            labelId="sort-field-label"
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
          <InputLabel id="order-label">Order</InputLabel>
          <Select
            value={selectedOrder}
            onChange={(e) => setSelectedOrder(e.target.value)}
            labelId="order-label"
            label="Order"
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </div>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onApply} color="primary">
        Apply Sort
      </Button>
    </DialogActions>
  </Dialog>
);

export default SortDialog;