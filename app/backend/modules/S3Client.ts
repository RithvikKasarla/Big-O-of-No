// Load the SDK for JavaScript
const env = require("dotenv/config");

var AWS = require('aws-sdk');
// Set the Region 
AWS.config.update({region: env('AWS_REGION')});