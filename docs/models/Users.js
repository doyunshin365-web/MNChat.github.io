const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    pw: { type: String, required: true },
    desc: { type: String, required: true },
    friends: { type: Array, required: true },
    profileImage: { type: String, default: 'Default' },
    country: { type: String, default: 'kr' }
});

module.exports = mongoose.model('User', userSchema);