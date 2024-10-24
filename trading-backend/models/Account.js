const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AccountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Relasi ke model User
        required: true
    }
});

// Middleware untuk mengenkripsi password sebelum disimpan
AccountSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const Account = mongoose.model('Account', AccountSchema);
module.exports = Account;
