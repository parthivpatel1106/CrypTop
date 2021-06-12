const mysql=require("mysql")
const express=require('express')
const app=express()
const passwordValidator=require("password-validator")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")
//const googleChartNode=require("google-charts-node")
//const { connect } = require("mongodb")
//const bodyParser=require("body-parser")
const sqlConn=require("../app.js")
const { response } = require("express")
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
                        //api start
                        const rp = require('request-promise');
                        const requestOptions = {
                        method: 'GET',
                        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
                        //uri:"https://pro-api.coinmarketcap.com/v1/fiat/map",
                        qs: {
                            'start': '1',
                            'limit': '5000',
                            'convert': 'USD'
                        },
                        headers: {
                            'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_API_KEY
                        },
                        json: true,
                        gzip: true
                        };
                        rp(requestOptions).then(response => {
                            console.log('API call response:', response.data[0].quote);
                            // let bitcoinPrice= response.data[0].quote.USD.price
                            // let ethereumPrice= response.data[1].quote.USD.price
                            // let tetherPrice= response.data[2].quote.USD.price
                            // let binanceCoinPrice= response.data[3].quote.USD.price
                            // let cardanoPrice= response.data[4].quote.USD.price
                            // console.log(bitcoinPrice)
                            const marketCaps=[]
                            const cryptoPrice=[]
                            const percentChange=[]
                            for(let i=0;i<5;i++)
                            {
                                cryptoPrice.push(response.data[i].quote.USD.price)
                                marketCaps.push(response.data[i].quote.USD.market_cap)
                                percentChange.push(response.data[i].quote.USD.percent_change_1h)
                            }
                            //console.log(marketCaps)
                            //bitcoinPriceList.push(bitcoinPrice);
                            res.status(200).render("userHomePage",{
                                bitcoinPrice:cryptoPrice[0].toFixed(2),
                                ethereumPrice:cryptoPrice[1].toFixed(2),
                                tetherPrice:cryptoPrice[2].toFixed(2),
                                binanceCoinPrice:cryptoPrice[3].toFixed(2),
                                cardanoPrice:cryptoPrice[4].toFixed(2),
                                bitcoinMarketCap:marketCaps[0].toFixed(0),
                                ethereumMarketCap:marketCaps[1].toFixed(0),
                                tetherMarketCap:marketCaps[2].toFixed(0),
                                binanceCoinMarketCap:marketCaps[3].toFixed(0),
                                cardanoMarketCap:marketCaps[4].toFixed(0),
                                bitcoinPercentChange:percentChange[0].toFixed(4),
                                ethereumPercentChange:percentChange[1].toFixed(4),
                                tetherPercentChange:percentChange[2].toFixed(4),
                                binanceCoinPercentChange:percentChange[3].toFixed(4),
                                cardanoPercentChange:percentChange[4].toFixed(4)   
                            })
                            }).catch((err) => {
                            console.log('API call error:', err.message);
                            });
                            //api ends

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

// exports.bitcoin=(req,res)=>{
//     const rp = require('request-promise');
//     const requestOptions = {
//     method: 'GET',
//     uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
//     qs: {
//         'start': '1',
//         'limit': '5000',
//         'convert': 'USD'
//     },
//     headers: {
//         'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_API_KEY
//     },
//     json: true,
//     gzip: true
//     };
//     var bitcoinPriceList=[];
//     let timeCount=0;
//     var timerID=setInterval(function(){
//         timeCount++;
//             if(timeCount===10)
//             {
//                 console.log("time out")
//                 console.log(bitcoinPriceList)
//                 clearInterval(timerID);
//             }
//         else{
//             rp(requestOptions).then(response => {
//                 //console.log('API call response:', response.data[0].quote.USD.price);
//                 let bitcoinPrice= response.data[0].quote.USD.price
//                 console.log(bitcoinPrice)
//                 bitcoinPriceList.push(bitcoinPrice);
//                 // res.render('userHomePage',{
//                 //     price:bitcoinPrice
//                 // })
//                 }).catch((err) => {
//                 console.log('API call error:', err.message);
//                 });
//         }
//     },15*1000)
//         //clearInterval(timerID)
// }


exports.bitcoin=(req,res)=>{
    const rp = require('request-promise');
    const requestOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
    qs: {
        'start': '1',
        'limit': '5000',
        'convert': 'USD'
    },
    headers: {
        'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_API_KEY
    },
    json: true,
    gzip: true
    };
    rp(requestOptions).then(response => {
        //console.log('API call response:', response.data[0].quote.USD.price);
        let bitcoinPrice= response.data[0].quote.USD.price
        let $1hPercent=response.data[0].quote.USD.percent_change_1h
        let $24hPercent=response.data[0].quote.USD.percent_change_24h
        let $7dPercent=response.data[0].quote.USD.percent_change_7d
        //console.log(bitcoinPrice)
        //bitcoinPriceList.push(bitcoinPrice);
        res.render('cryptoData',{
            price:bitcoinPrice,
            $1h_percent:$1hPercent.toFixed(4),
            $24h_percent:$24hPercent.toFixed(4),
            $7d_percent:$7dPercent.toFixed(4)
        })
        }).catch((err) => {
        console.log('API call error:', err.message);
        });    
}

// exports.ethereum=(req,res)=>{
//     const rp = require('request-promise');
//     const requestOptions = {
//     method: 'GET',
//     uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
//     qs: {
//         'start': '1',
//         'limit': '5000',
//         'convert': 'USD'
//     },
//     headers: {
//         'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_API_KEY
//     },
//     json: true,
//     gzip: true
//     };
//     rp(requestOptions).then(response => {
//         //console.log('API call response:', response.data[0].quote.USD.price);
//         let bitcoinPrice= response.data[4]
//         console.log(bitcoinPrice)
//         //bitcoinPriceList.push(bitcoinPrice);
//         res.send(bitcoinPrice)
//         }).catch((err) => {
//         console.log('API call error:', err.message);
//         });    
//}