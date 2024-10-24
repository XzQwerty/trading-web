const Order = require('../models/Order');
const User = require('../models/User');

// Create Order
exports.createOrder = async (req, res) => {
    const { userId, ...orderData } = req.body;

    // Validasi userId
    if (!userId || !isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        // Memastikan pengguna ada
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const order = new Order({ userId, ...orderData });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: 'Error creating order', error: error.message });
    }
};

// Get Orders by User ID
exports.getOrdersByUserId = async (req, res) => {
    const { userId } = req.params;

    // Validasi userId
    if (!userId || !isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const orders = await Order.find({ userId });
        res.json(orders);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching orders', error: error.message });
    }
};

// Update Order
exports.updateOrder = async (req, res) => {
    const { orderId } = req.params;

    // Validasi orderId
    if (!orderId || !isValidObjectId(orderId)) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }

    try {
        const order = await Order.findByIdAndUpdate(orderId, req.body, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: 'Error updating order', error: error.message });
    }
};

// Delete Order
exports.deleteOrder = async (req, res) => {
    const { orderId } = req.params;

    // Validasi orderId
    if (!orderId || !isValidObjectId(orderId)) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }

    try {
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting order', error: error.message });
    }
};

// Helper function to check valid Object ID
const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};
