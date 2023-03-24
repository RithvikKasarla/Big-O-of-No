const express = require("express");
//const path = require("path");
//const asyncHandler = require("express-async-handler");
var cors = require("cors");

require("dotenv/config");

const prismaClient = require("./modules/PrismaClient.ts");
const S3Client = require("./modules/S3Client.js");
const PORT = process.env.PORT || 3001;

const app = express();

var fileupload = require("express-fileupload");
app.use(fileupload());

app.use(cors());

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

//User related routes
//Gets all users
app.get(
  '/api/users',
  async (req,res) => {
    let users = await prismaClient.getUsers()
    if(users){
      res.status(200).send(users)
    }else{
      res.status(400).send("Error getting users")
    }
  });  

//Create new user
app.post(
  '/api/users/',
  async (req,res) => {
    //const {name, email} = req.params;
    //input validation.
    try{
      var name = req.body.name;
      var email = req.body.email;
    }catch(err){
      res.status(400).send("Error getting name or email")
      return
    }
    //Try to create user
    try{
      let user = await prismaClient.createUser(name,email)
      if(user){
        res.status(200).send(user)
      }
      //If user creation fails
    }catch(err){
      res.status(400).send("Error creating user")
      return
    }
  }
);
//class related rout

//file related routes
//Should return the file.
app.get(
  '/api/files/:id',
  async (req,res) => {
    res.status(500).send("Not implemented yet")
  });

//Posting a file.
//Should return the file id
//Requires form-data

app.post(
  '/api/files/',
  async (req,res) => {
    //Ensure content-type has multipart/form-data in it
    if(!req.headers['content-type'].includes('multipart/form-data')){
      res.status(400).send("Content-type must be form-data, was " + req.headers['content-type'])
      return
    }
    //Ensure file is present
    if(!req.files){
      res.status(400).send("req.file not present")
      return
    }
    console.log("Length " + req.files.length)
    console.log("File " + req.files.FormFieldName)
    //Ensure file is not empty
    if(req.files.length == 0){
      res.status(400).send("File is empty")
      return
    }
    //Ensure file is not undefined
    if(req.files['file'] == undefined){
      res.status(400).send("File is undefined")
      return
    }
    
  }
);
//Update/Replace/Iterate the file.
app.patch(
  '/api/files/:id',
  async (req,res) => {
    res.status(500).send("Not implemented yet")
  });
//post related routes


//TO DO
//CREATE EXPRESS INTERFACE
//SHOULD INCLUDE POST -- NEW USER
//SHOULD INCLUDE GET -- ALL USERSs
//CREATE DB ERROR HANDLING