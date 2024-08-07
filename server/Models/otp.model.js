const mongoose=require('mongoose')
const OtpSchema = new mongoose.Schema({
    contactNumber: {
        type: Number,
        required: true
    },
    otp: {
        type: Number,
        required: true,
    },
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 60 // Specifies the TTL (time to live) index (in seconds) for the document
    }
}, { timestamps: true });

module.exports = mongoose.model('Otp', OtpSchema);
