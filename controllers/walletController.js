const Wallet = require("../models/walletModel");


const handleAddMoneyToWallet = async (req, res) => {
    try{
        const user = req.user
        const amount = req.body.amount

        const wallet = await Wallet.findOne({userId: user})
        if(!wallet){
            return res.status(404).json({message: "Wallet not found."})
        }

        
        if(amount <= 0){
            return res.status(400).json({message: "Invalid amount."})
        }

        wallet.balance += parseFloat( amount ) 

        await wallet.save()

        return res.status(200).json({message: "Money added to wallet successfully."})

    } catch (error) {
        res.status(500).json({ error: error.message }) } 
}



const handleGetWalletBalance = async (req, res)=>{
     try{ const user = req.user
     
    const userWallet = await Wallet.findOne({ userId: user })

    if(!userWallet){
        return res.status(404).json({message: "Wallet not found."})
    }

    res.status(200).json({
        message: "Success",
        id: userWallet?.id,
        balance: userWallet?.balance 

    }) 
    } catch (error){ res.status(500).json({ error: error.message }) } } 



module.exports = {
    handleAddMoneyToWallet,
    handleGetWalletBalance
}
