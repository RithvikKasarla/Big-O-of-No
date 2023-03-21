const { S3 } = require('@aws-sdk/client-s3');
//for handling files?
const fs = require('fs');
//for handling streams?
const Stream = require('stream');
//dotenv
const dotenv = require('dotenv');
dotenv.config({ path: __dirname+'/../.env' });
//confirm dotenv is working
console.log(process.env);

const ACCESS_KEY = process.env['ACCESS_KEY']; 
const SECRET_ACCESS_KEY = process.env['SECRET_ACCESS_KEY'];
const BUCKET_NAME = 'big-no-s3-dev';
const REGION = "us-east-2";


const client = new S3({
    region: REGION,
    endpoint: process.env.S3_ENDPOINT,
    
});

/*
const create_params = {
    Bucket: BUCKET_NAME,
    CreateBucketConfiguration: {
        LocationConstraint: REGION
    }
};
//to create a bucket.

s3.createBucket(create_params, function (err, data) {
    if (err) {
        console.log(err, err.stack);
    } else {
        console.log('Bucket Created Successfully', data.Location);
    }
});
*/
module.exports.createBucket = async function (bucketName) {
    let createParams = {
        Bucket: bucketName,
        CreateBucketConfiguration: {
            LocationConstraint: REGION
        }
    };
    let createRes = await client.createBucket(createParams)
};
module.exports.uploadFile = async function (file, fileName) {
    let uploadParams = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: file,
    };
    console.log(uploadParams)
    let uploadRes = await client.putObject(uploadParams)
};