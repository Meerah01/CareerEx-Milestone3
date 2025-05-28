const jwt = require("jsonwebtoken");
const Auth = require("../models/authModel");


const validateRegister = (req, res, next)=>{
    const { username, email, password } = req.body

    const errors = []

    if(!email){
        errors.push("Please add your email.")
    }
    if(!password){
        errors.push("Please add your password.")
    }
    if(!username){
        errors.push("Please add your username.")
    }

    if(errors.length > 0){
        return res.status(400).json({message: errors})
    }

    next()

}



const validateLogin = (req, res, next) => {
    const {email, password} = req.body

    const errors = []

    if(!email) {
        errors.push("Please add your email.")
    } else if(!validEmail) {
        errors.push("Incorrect email format.")
    }

    if(!password) {
        errors.push("Please enter your password.")
    }

    if(errors.length > 0){
        return res.status(400).json({message: errors})
    }

    next()
}



const validEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  } 




const userAuthorization = async (req, res, next)=>{

    const token = req.header("Authorization")
    if(!token){
        return res.status(401).json({message: "Please login!"})
    }

    const splitToken = token.split(" ")
    const realToken = splitToken[1]

    const decoded = jwt.verify(realToken, `${process.env.ACCESS_TOKEN}`)
    if(!decoded){
        return res.status(401).json({message: "Please Login."})
    }

    const user = await Auth.findById(decoded.id)
    if(!user){
        return res.status(404).json({message: " User account doesn't exist."})
    }

    req.user = user

    next()
}



const adminAuthorization = async (req, res, next)=>{

    const token = req.header("Authorization")
    if(!token){
        return res.status(401).json({message: "Please login!"})
    }

    const splitToken = token.split(" ")
    const realToken = splitToken[1]

    const decoded = jwt.verify(realToken, `${process.env.ACCESS_TOKEN}`)
    if(!decoded){
        return res.status(401).json({message: "Please Login."})
    }

    const user = await Auth.findById(decoded.id)
    if(!user){
        return res.status(404).json({message: " User account doesn't exist."})
    }

    if(user?.role !== "admin"){
       return res.status(404).json({message: " INVALID AUTHORIZATION."})
    }

    req.user = user

    next()
}

module.exports = {
    validateRegister,
    validateLogin,
    validEmail,
    userAuthorization,
    adminAuthorization
}