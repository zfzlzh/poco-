const express=require("express");
const index = require("./route/index.js");
const details = require("./route/details.js");
const list = require("./route/list.js");
const author = require("./route/author.js");
const main =require("./route/main.js");
const users=require("./route/users.js")
const cors=require("cors");
var app=express();
app.listen (3000);
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended:false
}));
const session = require("express-session")

app.use(session({
  secret:"128位随机字符",    
  resave:false,             
  saveUninitialized:true,   
  cookie:{
    maxAge:1000 * 60 * 60 * 24 
  }
}));

app.use(express.static('public'));
 app.use(cors({
  origin:"http://localhost:3000"
}))
app.use("/index",index);
app.use("/details",details);
app.use("/list",list);
app.use("/author",author);
app.use("/users",users);
app.use("/main",main)
