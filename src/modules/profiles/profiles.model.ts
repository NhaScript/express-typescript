import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
     firstName: {
        type: String,
        required: true
     },
     lastName: {
        type: String,
        required: true
     },
     user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'User'
     },
     username: {
        type: String,
        required: true,
        unique: true,
        trim: true
     },
     headLine: {
        type: String
     },
     jobTitle: {
        type: String
     },
     education: {
        type: String
     },
     location: {
        type: String
     },
     address: {
        type: String
     },
     profilePhotoUrl: {
        type: String
     },
     profileBannerUrl: {
        type: String
     },
     qrCode: {
        enabled: {
            type: Boolean,
            required: true
        },
        qrId: {
            type: String,
            required: true
        }
     },
     itemsService: {
        service:{
            type:  mongoose.Schema.Types.ObjectId,
            required: true
        },
        title: {
            type: String
        },
        value: {
            type: String,
            required: true
        },
        order: {
            type: Number
        },
        customIconUrl: {
            type: String,
        },
        enabled: {
            type: Boolean
        }
     }
}, {timestamps: true})
exports.Profile = mongoose.model("Profile", profileSchema)
