const express = require("express");
const path = require("path");
const asyncHandler = require("express-async-handler");
var cors = require("cors");

require("dotenv/config");

const prismaClient = require("./PrismaClient.ts");
const PORT = process.env.PORT || 3001;

const app = express();



prismaClient.createUser("Jeff2","bezos@aws.com");
prismaClient.getUsers();

app.use(cors());

app.use(express.static(path.join(__dirname, "..", "client", "build")));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get(
  "/deployFile/:fileName",
  asyncHandler(async (req, res) => {
    var url = req.params.url;
    var code = req.params.code;
    
  })
);
//TO DO
//CREATE EXPRESS INTERFACE
//SHOULD INCLUDE POST -- NEW USER
//SHOULD INCLUDE GET -- ALL USERSs