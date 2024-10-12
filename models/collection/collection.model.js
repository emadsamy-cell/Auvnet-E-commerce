const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    banner: {
        type: String,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    visibility: {
        type: String,
        enum: ['public', 'hidden'],
        default: 'public',
    },
    totalLikes: {
        type: Number,
        default: 0,
    },
    totalDislikes: {
        type: Number,
        default: 0,
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Collection', collectionSchema);