const express = require("express");
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

module.exports=router;