const express = require('express');
const { createOrder, getOrdersByUserId, updateOrder, deleteOrder } = require('../controllers/orderController');

const router = express.Router();

// Route untuk membuat pesanan
router.post('/', createOrder);

// Route untuk mendapatkan semua pesanan berdasarkan User ID
router.get('/:userId', getOrdersByUserId);

// Route untuk memperbarui pesanan
router.put('/:orderId', updateOrder);

// Route untuk menghapus pesanan
router.delete('/:orderId', deleteOrder);

module.exports = router;
