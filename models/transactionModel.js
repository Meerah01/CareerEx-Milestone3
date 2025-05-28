const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true
        },
    recepientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true 
    },
    amount: {
        type: Number,
        required: true
    },
}, {timestamps: true})


const Transaction = mongoose.model("Transaction", transactionSchema)

module.exports = Transaction 