import React, { useState } from "react";
import ContactTable from "./components/ContactTable";
import AddContactDialog from "./components/AddContactDialog";

const App = () => {
  const [open, setOpen] = useState(false);

  const refreshData = () => window.location.reload();

  return (
    <div className="App">
      <ContactTable onAdd={() => setOpen(true)} />
      <AddContactDialog
        open={open}
        onClose={() => setOpen(false)}
        onRefresh={refreshData}
      />
    </div>
  );
};

export default App;
