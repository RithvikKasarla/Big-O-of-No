import * as dotenv from 'dotenv';
dotenv.config();

import { Upload } from "@aws-sdk/lib-storage";
import { S3Client, S3 } from "@aws-sdk/client-s3";

import { createReadStream } from 'fs';
import { param } from 'express-validator';

class S3Service {
    private config = {
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        }
    }

    //Upload File to S3
    //Uses multipart upload.
    //Should return the S3 URL of the file (string)
    public async uploadFile (username: string, local_file_path: string, filename: string): Promise<string>{
        let splitFilename = filename.split('.');
        let name = splitFilename[0];
        let extension = splitFilename[1];
        let iteration = 0;
    
        const findValidName = () => {
            return new Promise<string>(async resolve => {
                const s3 = new S3(this.config);
        
                
                // Call listObjectsV2 to list objects with the specified prefix and delimiter
                // Check 
                let data = await s3.listObjectsV2({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Prefix: `cdn/${username}/${name}(${iteration}).${extension}`,
                    Delimiter: '/'
                });
                console.log(`DATA: ${JSON.stringify(data)}`);
                while(data.Contents && data.Contents.length > 0){
                    iteration++;
                    console.log(`File "${name}(${iteration}).${extension}" already exists, adding (${iteration}) to the end of the filename.`);
                    
                    data = await s3.listObjectsV2({
                        Bucket: process.env.S3_BUCKET_NAME,
                        Prefix: `cdn/${username}/${name}(${iteration}).${extension}`,
                        Delimiter: '/'
                    });
                    console.log(`DATA: ${JSON.stringify(data)}`);
                }
                console.log(`Found valid name: ${name}(${iteration}).${extension}`)
                resolve(`${name}(${iteration}).${extension}`);
            });
        }
        filename = await findValidName();
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `cdn/${username}/${name}(${iteration}).${extension}`,
            Body: createReadStream(local_file_path), // add verification check.
            ACL: 'public-read',
            ContentType: 'image/png', //make this dynamic
            ContentDisposition: 'inline'
        }
        try {
            const multiPartUpload = new Upload({
                client: new S3Client(this.config),
                params: params,
                queueSize: 4,
                partSize: 1024 * 1024 * 5,
                leavePartsOnError: false,
            });   

            multiPartUpload.on('httpUploadProgress', (progress) => {
                console.log(progress);
            });

            await multiPartUpload.done();
            console.log('File Uploaded');
            //return the S3 URL of the file
            //https://BUCKET.s3.REGION.amazonaws.com/cdn/USERNAME/FILENAME
            console.log(`Returning S3URL = https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/cdn/${username}/${filename}`);
            return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/cdn/${username}/${filename}`;
        } catch (error) {
            throw error;
        }
    }

    //Delete File from S3

}

export default S3Service;