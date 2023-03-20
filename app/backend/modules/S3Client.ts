
// import individual service
import S3 from 'aws-sdk/clients/s3';
//for handling files?
import fs from 'fs';
//dotenv
require('dotenv').config();
//confirm dotenv is working
console.log(process.env);

const ACCESS_KEY = process.env.ACCESS_KEY; //replace with dotenv
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY; //replace with dotenv
const BUCKET_NAME = 'big-no-s3-dev';
const REGION = "us-east-2";


const s3 = new S3({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
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
    s3.createBucket(createParams, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log('Bucket Created Successfully', data.Location);
        }
    });
};
module.exports.uploadFile = async function (file, fileName,bucketName) {
  let uploadParams = {
    Bucket: bucketName,
    Key: fileName,
    Body: file,
  };
  s3.upload(uploadParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    } if (data) {
      console.log("Upload Success", data.Location);
    }
  });
};