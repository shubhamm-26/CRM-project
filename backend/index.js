const express = require('express');
const cors = require('cors');
require('./db/mongoose');
const contactRouter = require('./routes/contactRoute');


const app = express();
const port =5000;

app.use(cors());
app.use(express.json());

app.use(contactRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});
