const express = require("express");
const bodyParser=require("body-parser")
var jsonParser=bodyParser.json()
var urlEncoder=bodyParser.urlencoded({extended:true})
const router = express.Router();


// router.get('/',(req,res)=>{
//     res.send("hello")
// })
router.get("/",(req,res) =>{
    res.render('landingPage')
    //console.log('working')
})
router.get("/adminPanel",(req,res)=>{
    res.render('adminPage')
})
router.get('/signUp',(req,res)=>{
    res.render('userCreateAccount')
})
router.get('/logIn',function(req,res){
    res.render('userLoginAccount')
})

router.get('/home',(req,res)=>{
    res.render('userHomePage')
})

// router.get("/userProfile",(req,res)=>{
//     res.render('userProfile')
// })
// router.get('/cryptoData',(req,res)=>{
//     res.render('cryptoData')
// })
module.exports=router;