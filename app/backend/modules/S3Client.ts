// Load the SDK for JavaScript
import { S3Client, AbortMultipartUploadCommand } from "@aws-sdk/client-s3";
// Set the Region 
module.exports.region = "us-east-1";

// a client can be shared by different commands.
const client = new S3Client({ region: "REGION" });

const params = {
  /** input parameters */
  'Bucket': 'BUCKET',
};
const command = new AbortMultipartUploadCommand(params);