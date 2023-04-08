import * as dotenv from 'dotenv';
dotenv.config();

import * as express from 'express';
import { Request, Response} from 'express';
import { body, validationResult } from 'express-validator';

//fileupload
import fileUpload from 'express-fileupload';

//S3 service. 
//Handles all S3 related operations.
import S3Service from '../services/s3.service';
//RDS service. 
//Handles all RDS related operations.
import RDSService from '../services/rds.service';
//File service.
//Handles all file related operations.
import FileService from '../services/files.service';
//Later; Privately accessible, requires cognito.
//for now, publically accessible.
class CDNController{
    public path = '/cdn';
    public router = express.Router();
    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        //Get response for this.path for resource this.index.
        // /cdn returns => index.
        this.router.get('', this.getResource);
        //Post resposne for this.path for resource this.index.
        // /cdn returns => index.
        this.router.post('', this.postResource);
    }

    //Get response for this.path for resource this.index.
    getResource = async (request: Request, response: Response) => {
        response.send('Hello World! -- CDN Controller -- GET');
        //response.send('Hello World! -- CDN Controller');
        
        //Get S3_URL of a file.
        //Should not require Cognito.
    }
    //Does not yet support multipart uploads, but will.
    //Currently only supports single file uploads (50-35MiB)
    //Post response for this.path for resource this.index.
    postResource = async (request: Request, response: Response) => {
        response.send('Hello World! -- CDN Controller -- POST');

        const username = "jeff"; //should get this from Cognito.
        let file;
        //Post a file to S3.
        //File should be posted to /username/filename  https://stackoverflow.com/questions/37963906/how-to-get-user-attributes-username-email-etc-using-cognito-identity-id

        //Validate the response
        console.log("postResource validation not implemented yet.")
        //
        file = request.files.file;
        const filename = file.name;
        //Get filename
        
        console.log(request.files);
        console.log("file: ", file);
        //console.log("filename: ", file);
        //const filename = file.name;
        const fileService = new FileService();
        const local_file_path = await fileService.downloadFile(username, file, filename); //should return path of file after its saved.
        console.log("Saved file to: ", local_file_path);
        if(local_file_path == ""){
            return response.status(500).send("Could not download file.");
        }
        
        //Upload file to S3.
        const s3Service = new S3Service();

        let s3_url = await s3Service.uploadFile(username, local_file_path, filename);
        console.log("Uploaded file to: ", s3_url);
        //Upon successful upload to S3, delete local file.
        let deleted_file = await fileService.deleteFile(local_file_path);
        if(deleted_file){
            console.log("Deleted file: ", local_file_path);
        }else{
            console.log("Could not delete file: ", local_file_path);
        }
        // while file its being delete, create a MySQL File Entry for the file.
        //Create a MySQL File Entry.
        
    }
}

export default CDNController;