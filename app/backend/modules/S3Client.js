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
    credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_ACCESS_KEY
    }
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
//Should not be called by the api..
module.exports.uploadFile = async function (file, fileName) {
    let uploadParams = {
        Bucket: BUCKET_NAME,
        Key: fileName, //Generate a unique name for the file
        Body: file,
        ACL: 'public-read' //public read access so that anyone can access the file
    };
    console.log("Upload Params: " + uploadParams)
    let uploadRes = await client.putObject(uploadParams)
    //if upload is successful, return the link to the file.
    if(uploadRes.$metadata.httpStatusCode == 200){
        return "https://big-no-s3-dev.s3.us-east-2.amazonaws.com/" + fileName;
    }else{
        return null;
    }
};

module.exports.multipartUpload = async function (filePath, fileName) {
    //Initiate the multipart upload
    let initParams = {
        Bucket: BUCKET_NAME,
        Key: fileName, //Generate a unique name for the file
        ACL: 'public-read' //public read access so that anyone can access the file
    };
    let initRes = await client.createMultipartUpload(initParams, function (err, data) {
        if(err){
            console.log(err); //Failure
        }else{
            console.log(data); //Success
        }
        /*
        data = {
        Bucket: "examplebucket", 
        Key: "largeobject", 
        UploadId: "ibZBv_75gd9r8lH_gqXatLdxMVpAlj6ZQjEs.OwyF3953YdwbcQnMA2BLGn8Lx12fQNICtMw5KyteFeHw.Sjng--"
        }
        */
    });
    //Upload part(s)

    //Complete the multipart upload
    let completeParams = {

    }
    let completeRes = await client.completeMultipartUpload(completeParams, function (err, data) {
    });
}
//Get link to file.

