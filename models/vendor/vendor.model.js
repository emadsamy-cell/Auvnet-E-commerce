const { status } = require('../../enums/vendor');
const roles = require('../../enums/roles');
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
        default: "Not Verified OTP"
    },
    OTPExpiresAt: {
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
        enum: [status.ACTIVE, status.INACTIVE],
        default: status.ACTIVE
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
    role: {
        type: String,
        default: roles.VENDOR
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        default: 'Male'
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    totalLikes: {
        type: Number,
        default: 0
    },
    totalDislikes: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    collections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
    }]
}, {
    timestamps: true
});

vendorSchema.index({ location: '2dsphere' });

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;