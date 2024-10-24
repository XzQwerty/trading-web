const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Account = require('./models/Account');
const Transaction = require('./models/Transactions');
const Order = require('./models/Order');
const router = express.Router();

// Middleware untuk autentikasi pengguna
const authenticate = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Access denied' });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// User registration
router.post('/auth/register', [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        // Create account for new user
        const account = new Account({ userId: newUser._id, balance: 0 });
        await account.save();

        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
});

// User login
router.post('/auth/login', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token });
});

// Get cash management data
router.get('/cash-management', authenticate, async (req, res) => {
    const account = await Account.findOne({ userId: req.user._id }); // Ambil akun berdasarkan userId
    const transactions = await Transaction.find({ userId: req.user._id }); // Ambil transaksi berdasarkan userId
    res.json({ balance: account.balance, transactions });
});

// Add new transaction
router.post('/cash-management/transactions', 
    authenticate, 
    [
        body('date').isDate().withMessage('Date must be a valid date'),
        body('description').isString().notEmpty().withMessage('Description cannot be empty'),
        body('amount').isNumeric().withMessage('Amount must be a number')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { date, description, amount } = req.body;

        const newTransaction = new Transaction({
            userId: req.user._id,
            date,
            description,
            amount,
            status: 'completed' // Menambahkan status transaksi
        });
        
        await newTransaction.save();

        const account = await Account.findOne({ userId: req.user._id });
        account.balance += amount;
        await account.save();

        res.status(201).json({ transaction: newTransaction });
});

// Fetch all transactions
router.get('/transactions', authenticate, async (req, res) => {
    const transactions = await Transaction.find({ userId: req.user._id });
    res.json(transactions);
});

// Fetch all orders
router.get('/orders', authenticate, async (req, res) => {
    const orders = await Order.find({ userId: req.user._id });
    res.json(orders);
});

// Add new order
router.post('/orders', 
    authenticate, 
    [
        body('productId').isString().notEmpty().withMessage('Product ID is required'),
        body('product').isString().notEmpty().withMessage('Product name is required'),
        body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
        body('totalPrice').isNumeric().withMessage('Total price must be a number'),
        body('payment').isString().notEmpty().withMessage('Payment method is required'),
        body('shipping').isString().notEmpty().withMessage('Shipping address is required')
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { productId, product, quantity, totalPrice, payment, shipping } = req.body;

        const newOrder = new Order({
            userId: req.user._id,
            productId,
            product,
            quantity,
            totalPrice,
            payment,
            shipping,
            status: 'pending' // Menambahkan status order
        });

        await newOrder.save();
        res.status(201).json(newOrder);
});

// Fetch order status
router.get('/orders/:id/status', authenticate, async (req, res) => {
    const order = await Order.findOne({ userId: req.user._id, _id: req.params.id });
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ status: order.status });
});

// Swagger Documentation
router.get('/api-docs', (req, res) => {
    res.json({
        message: 'API documentation will be available here',
        routes: [
            '/auth/register',
            '/auth/login',
            '/cash-management',
            '/cash-management/transactions',
            '/transactions',
            '/orders',
            '/orders/:id/status'
        ]
    });
});

module.exports = router;