const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const cashRoutes = require('./routes/cashRoutes');
const orderRoutes = require('./routes/orderRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const apiRoutes = require('./api'); 
const helmet = require('helmet');
const bodyParser = require('body-parser');


dotenv.config();

// Logging untuk memeriksa nilai MONGO_URI
console.log('MONGO_URI:', process.env.MONGO_URI);

// Inisialisasi Express app
const app = express();

// Middleware
app.use(helmet());
app.use(bodyParser.json());

// Rute API
app.use('/api/auth', authRoutes);
app.use('/api/cash', cashRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', registrationRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api', apiRoutes); 

// Route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Trading Backend API!');
});

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');

        // Mulai server setelah koneksi ke database berhasil
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
        process.exit(1); // Keluar jika koneksi gagal
    });