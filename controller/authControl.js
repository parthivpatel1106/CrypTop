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
const requestPromise = require("request-promise")
const chartjs=require("chart.js")
//var pop=require('popups')
const { connect } = require("mongodb")
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
            global.personaMail=logemail
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
                            'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_API_KEY3
                        },
                        json: true,
                        gzip: true
                        };
                        rp(requestOptions).then(response => {
                            // console.log('API call response:', response.data[0].quote);
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
exports.loginHome=(req,res)=>{
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
            'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_API_KEY3
        },
        json: true,
        gzip: true
        };
        rp(requestOptions).then(response => {
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
}

exports.cryptoData=(req,res)=>{
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
        'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_API_KEY3
    },
    json: true,
    gzip: true
    };
    rp(requestOptions).then(response => {
        //console.log('API call response:', response.data[0].quote.USD.price);
        var coinForum=["https://bitcointalk.org/","https://forum.ethereum.org/","https://twitter.com/tether_to","https://reddit.com/r/binance","https://forum.cardano.org/"]
        var coinSourceCode=["https://github.com/bitcoin/","https://github.com/ethereum","#","#","https://cardanoupdates.com/"]
        var whitePaper=["https://bitcoin.org/bitcoin.pdf","https://ethereum.org/en/whitepaper/","https://tether.to/wp-content/uploads/2016/06/TetherWhitePaper.pdf","https://www.exodus.com/assets/docs/binance-coin-whitepaper.pdf","https://docs.cardano.org/en/latest/"]
        var coinKey
        console.log(req.originalUrl)
        url=req.originalUrl
        global.coinUrl=url
        switch (req.originalUrl) {
            case '/auth/bitcoinData':
                coinKey=0
                console.log("fatching bitcoin data...")
                break;
            case '/auth/ethereumData':
                coinKey=1
                console.log("fatching ethereum data...")
                break;
            case '/auth/tetherData':
                coinKey=2
                console.log("fatching tether data...")
                break;
            case '/auth/binanceCoinData':
                coinKey=3
                console.log("fatching binance coin data...")
                break;
            case '/auth/cardanoData':
                coinKey=4
                console.log("fatching cardano data...")
                break;
            default:
                break;
        }
        var coinName=response.data[coinKey].name
        global.portfolioCoinName=coinName
        let coinPrice= response.data[coinKey].quote.USD.price
        //global.coinPrice=portfolioCoinPrice
        let $1hPercent=response.data[coinKey].quote.USD.percent_change_1h
        let $24hPercent=response.data[coinKey].quote.USD.percent_change_24h
        let $7dPercent=response.data[coinKey].quote.USD.percent_change_7d
        let $market_cap=response.data[coinKey].quote.USD.market_cap
        let $volume=response.data[coinKey].quote.USD.volume_24h
        let ratio=$volume/$market_cap
        var today=new Date()
        var time=today.getHours()+":"+today.getMinutes()+":"+today.getSeconds()
        console.log("time:",time)
        console.log(coinName)
        sqlConn.connect.query("SELECT * FROM user_portfolio WHERE email_id=? && coins=?",[personaMail,url],async(error,watchlistResults)=>{
            if(error)
            {
                console.log(error)
            }
            else
            {
                const watchString=JSON.stringify(watchlistResults)
                console.log(typeof(watchString))
                if(watchString==="[]")
                {
                    console.log("not results")
                    res.render('cryptoData',{
                        price:coinPrice,
                        $1h_percent:$1hPercent.toFixed(4),
                        $24h_percent:$24hPercent.toFixed(4),
                        $7d_percent:$7dPercent.toFixed(4),
                        marketCap:$market_cap.toFixed(0),
                        marketVolume:$volume.toFixed(0),
                        marketVolumeRatio:ratio.toFixed(5),
                        $coinName:coinName,
                        whitePaperLink:whitePaper[coinKey],
                        forumLink:coinForum[coinKey],
                        sourceCodeLink:coinSourceCode[coinKey]
                        //watchListMessage:"already in watchlist"
                    })                
                }
                else{
                    //console.log("here",watchlistResults)
                    res.render('cryptoData',{
                        price:coinPrice,
                        $1h_percent:$1hPercent.toFixed(4),
                        $24h_percent:$24hPercent.toFixed(4),
                        $7d_percent:$7dPercent.toFixed(4),
                        marketCap:$market_cap.toFixed(0),
                        marketVolume:$volume.toFixed(0),
                        marketVolumeRatio:ratio.toFixed(5),
                        $coinName:coinName,
                        whitePaperLink:whitePaper[coinKey],
                        forumLink:coinForum[coinKey],
                        sourceCodeLink:coinSourceCode[coinKey],
                        watchListMessage:"already in watchlist"
                })
                }        
            }
        })
        }).catch((err) => {
        console.log('API call error:', err.message);
        });    
}


exports.userProfile=(req,res)=>{
    sqlConn.connect.query("SELECT * FROM user_signup where email_id=?",[personaMail],async(error,results)=>{    
        if(error)
        {
            console.log(error)
        }
        else
        {
            //console.log(results[0])
            var string=JSON.stringify(results[0]);
            //console.log(string)
            var json=JSON.parse(string)
            //console.log(json)
            sqlConn.connect.query("SELECT coins,coin_name FROM user_portfolio WHERE email_id=?",[personaMail],async(error,coinResult)=>{
                if(error)
                {
                    console.log(error)
                }
                else
                {
                    res.render('userProfile',{
                        firstname:json.first_name,
                        lastname:json.last_name,
                        emailId:json.email_id,
                        items:coinResult
                    })
                }
            })
        }
    })
}

exports.watchlist=(req,res)=>{
    console.log(url)
    sqlConn.connect.query('INSERT INTO user_portfolio SET ?',{email_id:personaMail,coins:url,coin_name:portfolioCoinName},(error,results)=>{
        if(error)
        {
            res.redirect(coinUrl)          
        }
        else
        {
            console.log("data added to table")
            //console.log("data",results)
            // res.render('cryptoData',{
            //     message:"currency added to your watchlist"
            // })
            res.redirect(coinUrl)
        }
    })  
}