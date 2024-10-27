const productRepo = require('../product/product.repo');
const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    upVotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    downVotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    voteCount: {
        type: Number,
        default: 0
    },
    replies: [{
        message: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

reviewSchema.index({ product: 1 });

module.exports = mongoose.model('Review', reviewSchema);