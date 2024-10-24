const Account = require('../models/Account');

// Get Account Balance
exports.getAccountBalance = async (req, res) => {
    const { accountId } = req.params;

    // Validasi accountId
    if (!accountId || !isValidObjectId(accountId)) {
        return res.status(400).json({ message: 'Invalid account ID' });
    }

    try {
        const account = await Account.findById(accountId);
        if (!account) return res.status(404).json({ message: 'Account not found' });
        res.json({ balance: account.balance });
    } catch (error) {
        res.status(400).json({ message: 'Error fetching account balance', error: error.message });
    }
};

// Deposit Funds
exports.depositFunds = async (req, res) => {
    const { accountId } = req.params;
    const { amount } = req.body;

    // Validasi accountId dan amount
    if (!accountId || !isValidObjectId(accountId)) {
        return res.status(400).json({ message: 'Invalid account ID' });
    }
    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Invalid deposit amount' });
    }

    try {
        const account = await Account.findById(accountId);
        if (!account) return res.status(404).json({ message: 'Account not found' });

        account.balance += amount;
        await account.save();
        res.json({ balance: account.balance, message: 'Deposit successful' });
    } catch (error) {
        res.status(400).json({ message: 'Error depositing funds', error: error.message });
    }
};

// Withdraw Funds
exports.withdrawFunds = async (req, res) => {
    const { accountId } = req.params;
    const { amount } = req.body;

    // Validasi accountId dan amount
    if (!accountId || !isValidObjectId(accountId)) {
        return res.status(400).json({ message: 'Invalid account ID' });
    }
    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Invalid withdrawal amount' });
    }

    try {
        const account = await Account.findById(accountId);
        if (!account) return res.status(404).json({ message: 'Account not found' });
        if (account.balance < amount) return res.status(400).json({ message: 'Insufficient funds' });

        account.balance -= amount;
        await account.save();
        res.json({ balance: account.balance, message: 'Withdrawal successful' });
    } catch (error) {
        res.status(400).json({ message: 'Error withdrawing funds', error: error.message });
    }
};

// Helper function to check valid Object ID
const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};
