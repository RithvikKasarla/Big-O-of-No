const { S3, S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
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

const { createReadStream } = require('fs');


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
//Eventually deprecated.
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

//Upload file using S3 Multipart Upload.
module.exports.multipartUpload = async function (filePath, fileName) {
    const target = { 
        Bucket: BUCKET_NAME,
        Key: fileName, 
        Body: createReadStream(filePath),
        ACL: 'public-read' //public read access so that anyone can access the file
    };
    try {
        const parallelUploads3 = new Upload({
            client: new S3Client({
                region: REGION,
                credentials: {
                    accessKeyId: ACCESS_KEY,
                    secretAccessKey: SECRET_ACCESS_KEY
                }
            }),
            queueSize: 4, // optional concurrency configuration
            partSize: 5242880, // optional size of each part
            leavePartsOnError: false, // optional manually handle dropped parts
            params: target,
        });
        
        parallelUploads3.on("httpUploadProgress", (progress) => {
            console.log(progress);
        });
        
        await parallelUploads3.done();
        console.log("Upload Complete");
    } catch (e) {
        console.log(e);
    }
}
//Get link to file.

