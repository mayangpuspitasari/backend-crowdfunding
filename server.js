const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Dummy for testing
app.get('/', (req, res) => res.send('API is running'));

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Rute untuk instansi
const InstansiRoutes = require('./routes/InstansiRoutes');
app.use('/instansi', InstansiRoutes);

// Rute untuk program
const ProgramRoutes = require('./routes/ProgramRoutes');
app.use('/program', ProgramRoutes);

//Mildware untuk mengupload file
app.use('/instansi', express.static(path.join(__dirname, 'instansi')));
app.use('/program', express.static(path.join(__dirname, 'program')));

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

