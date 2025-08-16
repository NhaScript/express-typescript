import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    order: {
        type: Number
    },
    enabled: {
        type: Boolean,
        default: true
    }
}, {timestamps: true})

exports.Service = mongoose.model("Service", serviceSchema)
