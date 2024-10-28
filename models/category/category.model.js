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
<<<<<<< HEAD
=======
    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    },
>>>>>>> 3789e6135be381a55e563446fb9db0152415a5b9
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
<<<<<<< HEAD
}, {
    timestamps: true
=======
>>>>>>> 3789e6135be381a55e563446fb9db0152415a5b9
});

CategorySchema.virtual('subCategories', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parent',
    justOne: false
});

<<<<<<< HEAD
CategorySchema.set('toJSON', {
    virtuals: true,  // Keeps virtuals like `id`
    transform: (doc, ret) => {
        delete ret.id;  // Remove `id`
        return ret;
    }
});

=======
>>>>>>> 3789e6135be381a55e563446fb9db0152415a5b9
CategorySchema.index({ depth: 1 })

module.exports = mongoose.model('Category', CategorySchema);