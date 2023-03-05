const express = require("express");
const path = require("path");
const asyncHandler = require("express-async-handler");
var cors = require("cors");

require("dotenv/config");

const prismaClient = require("./PrismaClient.ts");
const PORT = process.env.PORT || 3001;

const app = express();



prismaClient.createUser("Jeff3","bezos7@aws.com");
//prismaClient.getUsers();

app.use(cors());

app.use(express.static(path.join(__dirname, "..", "client", "build")));

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
app.post(
  '/api/users/',
  async (req,res) => {
    //const {name, email} = req.params;
    //input validation.
    const {name, email} = req.body;
  }
);
//class related rout

//file related routes

//post related routes


//TO DO
//CREATE EXPRESS INTERFACE
//SHOULD INCLUDE POST -- NEW USER
//SHOULD INCLUDE GET -- ALL USERSs
//CREATE DB ERROR HANDLING