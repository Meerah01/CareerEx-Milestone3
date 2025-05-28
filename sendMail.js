const nodemailer = require("nodemailer")

const sendForgotPasswordEmail = async ( email, token, username )=>{

    try{
        const mailTransport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: `${process.env.EMAIL}`,
                pass: `${process.env.EMAIL_PASSWORD}`
            },
        })

        const mailDetails = {
            from: `${process.env.EMAIL}`,
            to: `${email}`,
            subject: "Reset Password Notification",
            html:  `<div style="width: 600px; margin: 40px auto; background-color: #ffffff; padding: 20px; border: 1px solid #dddddd; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;">

            <h1 style="background-color: #007bff; color: #ffffff; padding: 10px; margin-top: 0; font-size: 20px; border-radius: 5px 5px 0 0;">Reset Password Notification</h1>

            <p style="padding: 20px 0;"> Hello ${username}</p>

            <p style="padding: 10px 0;">You have requested to reset your password. Please click the button below to reset your password:</p>

            <div style="text-align: center; margin: 20px 0;">
                <a href="https://www.fintech-digital-wallet.com/reset-password/${token}" style="background-color: #007bff; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
            </div>

            <p style="padding: 10px 0;">If the button does not work, please use the link below:</p>

            <p style="word-break: break-all; padding: 10px 0;">
                <a href="https://www.fintech-digital-wallet.com/reset-password/${token}" style="color: #007bff;"> Click this link... </a>
            </p>

            <p style="padding: 10px 0;">Best regards,</p>
            <p style="padding: 0;">Your PayFlow Team</p>

            <p style="padding: 10px 0 0 0; border-top: 1px solid #dddddd; font-size: 12px; color: #666666;">&copy; 2023 Your PayFlow. All rights reserved.</p>  
        </div> `
      
}
        await mailTransport.sendMail(mailDetails)
        
    }
        catch (error) {
        console.log(error)
    }}


    const validEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  } 

  module.exports = {
        sendForgotPasswordEmail,
        validEmail
    }

