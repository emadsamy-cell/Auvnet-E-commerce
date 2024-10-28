const mongoose = require('mongoose');
const { status } = require("../../enums/ads")
const { audienceLocation } = require("../../enums/coupon");

const adSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [status.ACTIVE, status.UPCOMING, status.EXPIRED],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        index: { expires: '0' } 
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    images: [{
        type: String 
    }],
    linkURL: {
        type: String, 
        required: true
    },
    targetAudience: [{
        type: {
            type: String,
            enum: [audienceLocation.REGION, audienceLocation.COUNTRY, audienceLocation.CITY],
        },
        location: {
            type: String,
        }
    }], 
    video: {
        type: String 
    }
}, {
    timestamps: true 
});

const Ad = mongoose.model('Ad', adSchema);

module.exports = Ad;
