
// import individual service
import S3 from 'aws-sdk/clients/s3';

import fs from 'fs';

const ACCESS_KEY = 'AKIAWRNI6JLGZCMTAXEY';
const SECRET_ACCESS_KEY = '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';
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