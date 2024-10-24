const express = require('express');
const { getAccountBalance, depositFunds, withdrawFunds } = require('../controllers/cashManagementController');

const router = express.Router();

// Route untuk mendapatkan saldo akun
router.get('/balance/:accountId', getAccountBalance);

// Route untuk menyetor dana
router.post('/deposit/:accountId', depositFunds);

// Route untuk menarik dana
router.post('/withdraw/:accountId', withdrawFunds);

module.exports = router;
