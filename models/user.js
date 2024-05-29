const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    // Schema Versioning Pattern
    schema_version: { type: Number, required: true, default: 1 },
    // Document Versioning Pattern
    revision: { type: Number, required: true, default: 1 },
    // Date created
    date_created: { type: Date, required: true },
    // Date Modified
    date_modified: { type: Date },

    username: { type: String, required: true },
    password: { type: String, required: true },
});

UserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
