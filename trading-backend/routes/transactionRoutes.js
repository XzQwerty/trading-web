const express = require('express');
const { createTransaction, getTransactions, getTransactionById, updateTransaction, deleteTransaction } = require('../controllers/transactionController');

const router = express.Router();

// Route untuk membuat transaksi
router.post('/', createTransaction);

// Route untuk mendapatkan semua transaksi
router.get('/', getTransactions);

// Route untuk mendapatkan transaksi berdasarkan ID
router.get('/:transactionId', getTransactionById);

// Route untuk memperbarui transaksi
router.put('/:transactionId', updateTransaction);

// Route untuk menghapus transaksi
router.delete('/:transactionId', deleteTransaction);

module.exports = router;
