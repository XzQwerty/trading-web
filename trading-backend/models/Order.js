const mongoose = require('mongoose');

// Membuat skema untuk Order
const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // ID pengguna
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Referensi ke model Product
    product: { type: String, required: true }, // Nama produk
    quantity: { type: Number, required: true }, // Jumlah produk
    totalPrice: { type: Number, required: true }, // Total harga
    status: {
        type: String,
        enum: ['pending', 'completed', 'canceled'],
        default: 'pending',
    },
    payment: {
        method: { type: String, required: true }, // Metode pembayaran
        status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }, // Status pembayaran
    },
    shipping: {
        address: { type: String, required: true }, // Alamat pengiriman
        method: { type: String, required: true }, // Metode pengiriman
    },
    createdAt: { type: Date, default: Date.now }, // Tanggal dibuat
    processedAt: { type: Date, default: null }, // Tanggal diproses
});

// Membuat model Order berdasarkan skema
const Order = mongoose.model('Order', orderSchema);

// Mengekspor model Order
module.exports = Order;
