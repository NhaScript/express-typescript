import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    name: {
        type: String,
    },
    website: {
        type: String,
    },
    address: {
        type: String
    },
    company: {
        type: String
    },
    jobTitle: {
        type: String
    },
    location: {
        type: String
    },
    exchangeSource: {
        type: String,
        enum: ["exchange", "manual"],
        required: true
    },
    note: [
        {
            text: String,
            date: Date.now()
        }
    ]
})

exports.Contact = mongoose.model("Contact", contactSchema)
