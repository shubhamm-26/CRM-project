import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, TextField, Button } from "@mui/material";

const AddContactDialog = ({ open, onClose, onRefresh, initialData }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
  });
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (initialData) {
        await axios.put(`http://localhost:5000/contacts/${initialData._id}`, formData);
      } else {
        await axios.post("http://localhost:5000/contacts", formData);
      }
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error saving contact:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="p-4 flex-col">
        {["firstName", "lastName", "email", "phone", "company", "jobTitle"].map(
          (field) => (
            <TextField
              key={field}
              name={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={handleChange}
              fullWidth
              size="small"
              style={{ marginBottom: "12px" }}
            />
          )
        )}
        <Button variant="contained" onClick={handleSubmit}>
          {initialData ? "Update" : "Add"}
        </Button>
      </div>
    </Dialog>
  );
};

export default AddContactDialog;
