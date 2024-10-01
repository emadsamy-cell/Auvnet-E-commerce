const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    OTP: {
        type: String,
        default: null
    },
    OTPExpireAt: {
        type: Date,
        default: null
    },
    country: {
        type: String,
        default: null
    },
    city: {
        type: String,
        default: null
    },
    region: {
        type: String,
        default: null
    },
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
        },
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    profileImage: {
        type: String,
        default: null
    },
    coverImage: {
        type: String,
        default: null
    },
    primaryPhone: {
        type: String,
        default: null
    },
    secondaryPhone: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: 'vendor'
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        default: 'Male'
    }
});

vendorSchema.index({ location: '2dsphere' });

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;