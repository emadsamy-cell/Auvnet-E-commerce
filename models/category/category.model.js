const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    depth: {
        type: Number,
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null,
        select: false
    }
},  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

CategorySchema.virtual('subCategories', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parent',
    justOne: false
});

module.exports = mongoose.model('Category', CategorySchema);