const Auth = require("../models/authModel");
const bcrypt = require("bcryptjs");
const Wallet = require("../models/walletModel");
const jwt = require("jsonwebtoken");
const { sendForgotPasswordEmail, validEmail } = require("../sendMail");


const handleUserRegistration = async (req, res)=>{
    
    try{
        const { username, email, password } = req.body

        if(!username){
            return res.status(400).json({message: "Please input a username."})
        }

        if(!email){
            return res.status(400).json({message: "Please add your email."})
        }

        if(!validEmail(email)) {
            return res.status(400).json({message: "Incorrect email format!"})
        }

        if(!password){
            return res.status(400).json({message: "Please enter password."})
        }


        const existingUser = await Auth.findOne({  email })

        if(existingUser){
            return res.status(400).json({message: "User account already exists."})
        }
        if(password.length < 8){
            return res.status(400).json({message: "Password should be a minimum of 8 characters"})
        }

        const hashedPassword = await bcrypt.hash(password, 12)


        const newUser = new Auth({
         username,
         email,
         password: hashedPassword,   
        })
        await newUser.save()

         // Auto-create wallet
        const userWallet = new Wallet({
            userId: newUser?._id,
            userBalance: newUser?._balance
        })
        await userWallet.save()


        res.status(201).json({
            message: "User account created successfully",
            newUser: { username, email, password },
            userWallet
        })

    } catch (error){
        res.status(500).json({ error: error.message })
    }
}



const handleUserLogin = async (req, res)=>{
    const { email, password } = req.body

    const user = await Auth.findOne({ email })
    if(!user){
        return res.status(404).json({message: "User account does not exist."})
    }

    const passwordMatch = await bcrypt.compare(password, user?.password)
    if(!passwordMatch){
        res.status(400).json({message: "Incorrect email or password."})
    }


    const accessToken = jwt.sign(
        {id: user?._id},
        process.env.ACCESS_TOKEN,
        {expiresIn: "15 minutes"}
    ) 

    const refreshToken = jwt.sign(
        {id: user?._id},
        process.env.REFRESH_TOKEN,
        {expiresIn: "30 minutes"}
    ) 

    res.status(200).json({
        message: "Login successful.",
        accessToken,
        user: {
            email: user?.email,
            username: user?.username,
            role: user?.role
        },
        refreshToken
    })
}



const handleForgotPassword = async (req, res)=>{
    const { email } = req.body

    const user = await Auth.findOne({ email })
    if(!user) {
        return res.status(404).json({message: "User not found!"})
    }

    const accessToken = await jwt.sign(
        {user},
        `${process.env.ACCESS_TOKEN}`,
        { expiresIn: "5 minutes"}
    )

    await sendForgotPasswordEmail(email, accessToken)

    res.status(200).json({message: "Please check your mail inbox."})
}



const handleResetPassword = async (req, res)=>{
    const { password } = req.body

    const user = await Auth.findOne({ email: req.user.email })
    if(!user) {
        return res.status(404).json({message: "User account not found."})
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    user.password = hashedPassword

    await user.save()

    res.status(200).json({message: "Password reset successful!"})
}



const handleGetAllUsers = async (req, res)=>{

    const allUsers = await Auth.find()

    res.status(200).json({
        message: "Successful",
        allUsers
    }) }



module.exports = {
    handleUserRegistration,
    handleUserLogin,
    handleForgotPassword,
    handleResetPassword,
    handleGetAllUsers,
}


