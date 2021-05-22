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



module.exports=router;