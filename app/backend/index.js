const express = require("express");
//const path = require("path");
//const asyncHandler = require("express-async-handler");
var cors = require("cors");

require("dotenv/config");

const prismaClient = require("./modules/PrismaClient.ts");
const PORT = process.env.PORT || 3001;

const app = express();



//prismaClient.createUser("Jeff3","bezos7@aws.com");
//prismaClient.getUsers();

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
  }
);
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
app/get(
  '/api/files/:id',
  (req,res) => {
    res.status(500).send("Not implemented yet")
  }
)
//Posting a file.
//Should return the file id
app.post(
  '/api/files/',
  (req,res) => {
    res.status(500).send("Not implemented yet")
  }
)
//Update/Replace/Iterate the file.
app.patch(
  '/api/files/:id',
  (req,res) => {
    res.status(500).send("Not implemented yet")
  }
)

//post related routes


//TO DO
//CREATE EXPRESS INTERFACE
//SHOULD INCLUDE POST -- NEW USER
//SHOULD INCLUDE GET -- ALL USERSs
//CREATE DB ERROR HANDLING