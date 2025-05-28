const Wallet = require("../models/walletModel");
const Transaction = require("../models/transactionModel");


const handleMoneyTransfer = async (req, res)=>{
    try{
        const { senderId, recepientId, amount } = req.body

        if(amount <= 0){
            return res.status(400).json({message: "Invalid amount!"})
        }

        const senderWallet = await Wallet.findOne({ userId: senderId })
        if(!senderWallet){
            return res.status(404).json({message: "Sender wallet not found!"})
        }

        const recepientWallet = await Wallet.findOne({ userId: recepientId })
        if(!recepientWallet){
            return res.status(404).json({message: "Recepient wallet not found!"})
        }

        if(senderWallet.balance < amount){
            return res.status(400).json({message: "Insufficient balance."})
        }

        senderWallet.balance -= amount
        recepientWallet.balance += amount

        await senderWallet.save()
        await recepientWallet.save()

        const userTransaction = new Transaction({
            senderId: senderId, 
            recepientId: recepientId,
            amount: amount 
        })
        await userTransaction.save()


        res.status(200).json({message: "Transfer Successful."})
    } 
    catch  (error){ 
        res.status(500).json({ error: error.message })
    }}



const handleAllPastTransactions = async (req, res) => {
    const userId = req.userId

    const transactions = await Transaction.find({
        senderId: userId,
        recepientId: userId
    })

    res.status(200).json({
        message: "Success.",
        transactions 
    })
} 


module.exports = {
    handleMoneyTransfer,
    handleAllPastTransactions
}