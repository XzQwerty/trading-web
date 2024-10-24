const express = require('express');
const { registerCustomer, getAllCustomers, getCustomerById, updateCustomer, deleteCustomer } = require('../controllers/registrationController');

const router = express.Router();

// Route untuk mendaftar pelanggan
router.post('/', registerCustomer);

// Route untuk mendapatkan semua pelanggan
router.get('/', getAllCustomers);

// Route untuk mendapatkan pelanggan berdasarkan ID
router.get('/:customerId', getCustomerById);

// Route untuk memperbarui pelanggan
router.put('/:customerId', updateCustomer);

// Route untuk menghapus pelanggan
router.delete('/:customerId', deleteCustomer);

module.exports = router;
