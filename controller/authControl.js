const mysql=require("mysql")
const express=require('express')
const app=express()
const passwordValidator=require("password-validator")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")
//const { connect } = require("mongodb")
//const bodyParser=require("body-parser")
const sqlConn=require("../app.js")
require('dotenv').config()
//const { connect } = require("mongodb")
exports.signup=(req,res)=>{
    // const fname=req.body.firstname
    // res.send("welcome"+fname)
    //console.log("fname",req.body.firstname);

    const fname=req.body.firstname;
    const lname=req.body.lastname;
    const email=req.body.useremail;
    const pwd=req.body.userpassword;
    const confirmpwd=req.body.userconfirmpassword;
    //console.log(typeof(pwd))
    sqlConn.connect.query('SELECT email_id FROM user_signup WHERE email_id=?',[email],async(error,results)=>{
        if(error){
            console.log(error)
        }
        console.log(pwd)
        console.log(confirmpwd)

        var schema=new passwordValidator()
        schema.is().min(8)
        schema.has().uppercase()
        schema.has().lowercase()
        schema.has().digits()
        schema.has().symbols(1)
        if(!schema.validate(pwd)){
            return res.render("userCreateAccount",{
                message:"*Password length must be 8 digits and must contain one capital letter, one small letter, one numeric digit and one special symbol"
            })
        }
        else if(results.length>0)
        {
            return res.render('userCreateAccount',{
                message:"Email already registered"
            })
        }
        else if(pwd!==confirmpwd)
        {
            return res.render('userCreateAccount',{
                message:"*Password don't match"
            })
        }  
        
        
        let hashedPassword= await bcrypt.hash(pwd,8)
        console.log(hashedPassword)
        sqlConn.connect.query('INSERT INTO user_signup SET ?',{first_name:fname,last_name:lname,email_id:email,password:hashedPassword},(error,results)=>{
            if(error)
            {
                console.log(error);
            }
            else
            {
                console.log(results)
                return res.render('userCreateAccount',{
                    message:"you have successfully registered"
                })
            }
        })  
    })
}

exports.login= async (req,res)=>{
        try {
            const logemail=req.body.useremail
            const logpwd=req.body.userpassword
            if(!logemail || !logpwd)
            {
                return res.status(400).render('createLoginAccount',{
                    message:"Please provide your credentials"
                })
            }
            //console.log(logemail)
            //console.log(logpwd)
            sqlConn.connect.query('SELECT * FROM user_signup WHERE email_id = ?',[logemail], async (error,results)=>{
                if(error){
                    console.log(error)
                }
                else{
                    //console.log(results[0])
                    if(!results ||!(await bcrypt.compare(logpwd,results[0].password)))
                    {
                        //console.log("here")
                        res.render('userLoginAccount',{
                            message:"*Email or Password is wrong"
                        });
                    }
                    else{
                        const id=results[0].id;
                        const token=jwt.sign({id:id},process.env.JWT_SECRET_KEY,{
                            expiresIn:process.env.JWT_KEY_EXPIRY
                        })
                        //console.log("token in ",token)
                        const cookieOption={
                            expires:new Date(
                                Date.now()+process.env.JWT_COOKIE_EXPIRY * 24 * 60 * 60 * 1000
                            ),
                            httpOnly:true
                        }
                        res.cookie('jwt',token,cookieOption);
                        res.status(200).render("userHomePage")
                    }
                }
            })
        } catch (error) {
            console.log(error)
        }

}

exports.logout= async (req,res)=>{
    res.cookie('jwt','',{
        maxAge:1
    })   
    res.redirect('/')
}

