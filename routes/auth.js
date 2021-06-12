const { urlencoded } = require("body-parser");
const express = require("express");
const router = express.Router();
const authController = require('../controller/authControl')
const bodyParser=require("body-parser")
var jsonParser=bodyParser.json()
var urlEncoder=bodyParser.urlencoded({extended:true})


router.post('/user_signup',urlEncoder,authController.signup)
router.post('/user_login',urlEncoder,authController.login)
router.get('/logOut',authController.logout)
router.get('/bitcoinData',authController.bitcoin)
//router.get('/ethereumData',authController.ethereum)
module.exports=router