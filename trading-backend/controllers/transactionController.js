const Transaction = require('../models/Transactions');

// Create Transaction
exports.createTransaction = async (req, res) => {
    const { amount, type, userId } = req.body;

    // Validasi input
    if (!amount || !type || !userId) {
        return res.status(400).json({ message: 'Amount, type, and userId are required' });
    }

    const transaction = new Transaction(req.body);
    try {
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ message: 'Error creating transaction', error: error.message });
    }
};

// Get Transactions
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching transactions', error: error.message });
    }
};

// Get Transaction by ID
exports.getTransactionById = async (req, res) => {
    const { transactionId } = req.params;

    // Validasi transactionId
    if (!transactionId || !isValidObjectId(transactionId)) {
        return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    try {
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.json(transaction);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching transaction', error: error.message });
    }
};

// Update Transaction
exports.updateTransaction = async (req, res) => {
    const { transactionId } = req.params;

    // Validasi transactionId
    if (!transactionId || !isValidObjectId(transactionId)) {
        return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    try {
        const transaction = await Transaction.findByIdAndUpdate(transactionId, req.body, { new: true });
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.json(transaction);
    } catch (error) {
        res.status(400).json({ message: 'Error updating transaction', error: error.message });
    }
};

// Delete Transaction
exports.deleteTransaction = async (req, res) => {
    const { transactionId } = req.params;

    // Validasi transactionId
    if (!transactionId || !isValidObjectId(transactionId)) {
        return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    try {
        const transaction = await Transaction.findByIdAndDelete(transactionId);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting transaction', error: error.message });
    }
};

// Helper function to check valid Object ID
const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};
