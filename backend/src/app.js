const express=require("express");
const cors=require("cors"); // for handling cross-origin data requests(different ports)

const app=express();

app.use(cors());

app.use(express.json());

app.get("health",(req,res)=>{
        res.json({Status:"UP"});
})                              // Because in real systems like kubernetes we need health check endpoints
module.exports=app;

