const Customer = require('../models/Customer');

// Register Customer
exports.registerCustomer = async (req, res) => {
    const { name, email } = req.body;

    // Validasi input
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    const customer = new Customer(req.body);
    try {
        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        res.status(400).json({ message: 'Error registering customer', error: error.message });
    }
};

// Get All Customers
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching customers', error: error.message });
    }
};

// Get Customer by ID
exports.getCustomerById = async (req, res) => {
    const { customerId } = req.params;

    // Validasi customerId
    if (!customerId || !isValidObjectId(customerId)) {
        return res.status(400).json({ message: 'Invalid customer ID' });
    }

    try {
        const customer = await Customer.findById(customerId);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching customer', error: error.message });
    }
};

// Update Customer
exports.updateCustomer = async (req, res) => {
    const { customerId } = req.params;

    // Validasi customerId
    if (!customerId || !isValidObjectId(customerId)) {
        return res.status(400).json({ message: 'Invalid customer ID' });
    }

    try {
        const customer = await Customer.findByIdAndUpdate(customerId, req.body, { new: true });
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (error) {
        res.status(400).json({ message: 'Error updating customer', error: error.message });
    }
};

// Delete Customer
exports.deleteCustomer = async (req, res) => {
    const { customerId } = req.params;

    // Validasi customerId
    if (!customerId || !isValidObjectId(customerId)) {
        return res.status(400).json({ message: 'Invalid customer ID' });
    }

    try {
        const customer = await Customer.findByIdAndDelete(customerId);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting customer', error: error.message });
    }
};

// Helper function to check valid Object ID
const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};
