const express = require("express");
const path = require("path");
const asyncHandler = require("express-async-handler");
var cors = require("cors");

require("dotenv/config");

const databaseLayer = require("./databaseapi.js");

const PORT = process.env.PORT || 3001;

const app = express();

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
    var iflinkexists = await databaseLayer.ifExist(url);
    var ifCodeExist = await databaseLayer.ifCodeExist(code);
    res.json({
      repeatLink: iflinkexists,
      repeatCode: ifCodeExist,
    });
  })
);
