const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    pw: { type: String, required: true },
    desc: { type: String, required: true },
    friends: { type: Array, required: true },
    profileImage: { type: String, default: 'Default' },
    country: { type: String, default: 'kr' },
    light: { type: Boolean, default: false },
    translatepreview: { type: Boolean, default: false },
    ainovaHistory: {type: Array, default: [{role: "assistant", content: "안녕!"}]}
});

module.exports = mongoose.model('User', userSchema);