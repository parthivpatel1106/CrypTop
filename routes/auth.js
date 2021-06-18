const { urlencoded } = require("body-parser");
const express = require("express");
const router = express.Router();
const authController = require('../controller/authControl')
const bodyParser=require("body-parser")
var jsonParser=bodyParser.json()
var urlEncoder=bodyParser.urlencoded({extended:true})


router.post('/user_signup',urlEncoder,authController.signup)
router.post('/user_login',urlEncoder,authController.login)
router.get('/user_login/home',authController.loginHome)
router.get('/logOut',authController.logout)
router.get('/bitcoinData',authController.cryptoData)
router.get('/ethereumData',authController.cryptoData)
router.get('/tetherData',authController.cryptoData)
router.get('/binanceCoinData',authController.cryptoData)
router.get('/cardanoData',authController.cryptoData)
router.get('/userProfile',authController.userProfile)
router.post('/watchList',urlEncoder,authController.watchlist)
module.exports=router