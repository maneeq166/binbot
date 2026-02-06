const jwt = require("jsonwebtoken")
const User = require("../../models/user.model")
const bcrypt = require("bcrypt");
exports.registerService = async ({username,email,password})=>{
    if(!username||!email||!password){
        return {
            data:null,
            message:"Required fields are missing",
            statusCode:400
        }
    }

    let user = await User.findOne({email});

    if(user||user._id){
        return {
            data:null,
            message:"username or password is wrong",
            statusCode:400
        }
    }

    let hashedPassword = await bcrypt.hash(password,10);

    user = await User.create({username,password:hashedPassword,email});

    return {
        data:user,
        message:"User created",
        statusCode:201
    }
}

exports.loginService = async ({email,password})=>{
    if(!email||!password){
        return {
            data:null,
            message:"Required fields are missing",
            statusCode:400
        }
    }

    let user = await User.findOne({email});

    if(!user||!user._id||!user.isActive){
        return {
            data:null,
            message:"Username or password is wrong",
            statusCode:400
        }
    }

    let token = jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRET);

    return {
        data:token,
        message:"Logged in!",
        statusCode:200
    }
}