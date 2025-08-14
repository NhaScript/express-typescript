import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String
    },
    imageUrl: {
        type: String
    },
    price: {
        type: Number
    },
    description: {
        type: String
    }
}, {timestamps: true})
exports.Product = mongoose.model("Product", productSchema)
