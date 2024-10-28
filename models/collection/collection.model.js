<<<<<<< HEAD
const { visibility } = require('../../enums/collection');
=======
>>>>>>> 3789e6135be381a55e563446fb9db0152415a5b9
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
<<<<<<< HEAD
        enum: [visibility.PUBLIC, visibility.HIDDEN],
        default: visibility.PUBLIC,
=======
        enum: ['public', 'hidden'],
        default: 'public',
>>>>>>> 3789e6135be381a55e563446fb9db0152415a5b9
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