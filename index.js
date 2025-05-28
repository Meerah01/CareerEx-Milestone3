const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const { handleForgotPassword, handleUserRegistration, handleUserLogin, handleResetPassword, handleGetAllUsers } = require("./controllers")
const { validateRegister, adminAuthorization, userAuthorization, validateLogin } = require("./middleware")
const { handleMoneyTransfer, handleAllPastTransactions } = require("./controllers/transactionController")
const { handleAddMoneyToWallet, handleGetWalletBalance } = require("./controllers/walletController")
dotenv.config()


const app = express()
app.use(express.json())

const PORT = process.env.PORT || 1200

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log(`MongoDB connected...`)

    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`)
    })
}) 


app.get("/", (req, res)=>{
    res.send("Welcome to FinTech payment system!")
})


// MILESTONE 1
// user registration
app.post("/register", validateRegister, handleUserRegistration) 

// user login
app.post("/login", validateLogin, handleUserLogin)



// MILESTONE 2
// password reset
app.post("/forgot-password", userAuthorization, handleForgotPassword)

// updating password
app.patch("/reset-password", userAuthorization, handleResetPassword)

// money transfer
app.post("/transfer-money", userAuthorization, handleMoneyTransfer) 

// getting all registered users
app.get("/all-users",  handleGetAllUsers)

// ---
// update user wallet
app.post("/add-money", userAuthorization, handleAddMoneyToWallet)

// adminAuthorization

// MILESTONE 3
// view wallet balance
app.get("/wallet-balance", userAuthorization, handleGetWalletBalance)

// view list of past transactions
app.get("/all-transactions", userAuthorization, adminAuthorization, handleAllPastTransactions)