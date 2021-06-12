const express=require('express')
//const {mongoClient, MongoClient}=require ('mongodb')
const app=express()
const router = express.Router();
const mysql=require('mysql')
const bodyParser=require("body-parser")
const cookieParser=require("cookie-parser")
const hbs=require('hbs')
require('dotenv').config();
const port=process.env.PORT
//const mongoose=require('mongoose')
// app.get("/",function(req,res){
//     //console.log(`"server start at port ${port}"`)
//     res.send("hello world")
// })
app.listen(port,()=>{
    console.log(`server started at port ${port}`)
})

var conn=mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
});
conn.connect(function(err){
    if(err){
        throw err;
    }
    console.log("MYSQL Connected")
})
module.exports.connect=conn;
app.set('view engine','hbs')
app.use(express.static('./public'))

app.use("/",require('./routes/route'))
app.use("/auth",require('./routes/auth'))

var jsonParser=bodyParser.json()
var urlEncoder=bodyParser.urlencoded({extended:true})
app.use(cookieParser());
//module.exports=conn
// app.use(express.urlencoded({extended:true}))
// app.use(express.json())

// app.get("/home",function(req,res){
//     res.render('landingPage')
//     //console.log('working')
// })

// app.get("/adminPanel",function(req,res){
//     res.render('adminPage')
// })
// 




//api call
