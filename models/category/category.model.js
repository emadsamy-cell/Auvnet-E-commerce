const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    depth: {
        type: Number,
        default: 1
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null,
        select: false
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
},  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}, {
    timestamps: true
});

CategorySchema.virtual('subCategories', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parent',
    justOne: false
});

CategorySchema.set('toJSON', {
    virtuals: true,  // Keeps virtuals like `id`
    transform: (doc, ret) => {
        delete ret.id;  // Remove `id`
        return ret;
    }
});

CategorySchema.index({ depth: 1 })

module.exports = mongoose.model('Category', CategorySchema);