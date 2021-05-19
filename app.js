const express=require('express')
//const {mongoClient, MongoClient}=require ('mongodb')
const app=express()
const mysql=require('mysql')
require('dotenv').config();
const port=process.env.PORT
//const mongoose=require('mongoose')
app.get("/",function(req,res){
    //console.log(`"server start at port ${port}"`)
    res.send("hello world")
})
app.listen(port,()=>{
    console.log(`server started at port ${port}`)
})

var conn=mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD
});
conn.connect(function(err){
    if(err){
        throw err;
    }
    console.log("MYSQL Connected")
})
// async function main() {
//     const url = "mongodb+srv://UserDB:Crystleclown1106@cluster0.5jzb1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
//     const client = new MongoClient(url,{useNewUrlParser: true,useUnifiedTopology: true} );
//     try{
//         console.log("MongoDB connected")
//         await client.connect()
//         await listDatabases(client)
//     }
//     catch(e){
//         console.log(e);
//     }
//     finally{
//         await client.close();
//     }
// }
// main().catch(console.error);

// async function listDatabases(client){
//     const dbList= await client.db().admin().listDatabases();

//     console.log("databases:")
//     dbList.databases.forEach(db=>{
//         console.log(`-${db.name}`)
//     })
// }