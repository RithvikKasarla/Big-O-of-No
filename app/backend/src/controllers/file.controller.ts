import * as dotenv from 'dotenv';
dotenv.config();

import * as express from 'express';
import { Request, Response} from 'express';
import { body,param, query, validationResult } from 'express-validator';
import {User} from '@prisma/client';
//fileupload
import fileUpload from 'express-fileupload';
import AuthMiddleware from '../middleware/auth.middleware';

//S3 service. 
//Handles all S3 related operations.
import S3Service from '../services/s3.service';
//RDS service. 
//Handles all RDS related operations.
import RDSService from '../services/rds.service';
//File service.
//Handles all file related operations.
import FileService from '../services/localfs.service';
//Cognito service.
//Handles all cognito related operations.
import CognitoService from '../services/auth.service';
import UserService from '../services/user.service';
//Later; Privately accessible, requires cognito.
//for now, publically accessible.
class CDNController{
    public path = '/file';
    public router = express.Router();
    private authMiddleware: AuthMiddleware;
    constructor() {
        this.authMiddleware = new AuthMiddleware();
        this.initializeTokenRoutes();
        this.initializeAdminRoutes();
    }

    public initializeTokenRoutes() {
        const tokenMiddleware = this.authMiddleware.verifyToken;
        //this.router.use(this.authMiddleware.verifyToken); //All functions after this require a token.
        this.router.post('',this.validateBody('getFiles'),tokenMiddleware, this.getFiles);
        this.router.delete('/:fileId',this.validateBody('deleteFile'),tokenMiddleware, this.deleteFile);
        this.router.put('',this.validateBody('createFile'),tokenMiddleware, this.createFile);

    }
    public initializeAdminRoutes() {
        const adminMiddleware = this.authMiddleware.verifyAdmin;
        //this.router.use(this.authMiddleware.verifyAdmin) //All functions after this require admin.
        this.router.post('/all',this.validateBody('getFilesForced'),adminMiddleware, this.getFilesForced);
        this.router.delete('/all/:fileId',this.validateBody('deleteFileForced'),adminMiddleware, this.deleteFileForced);
    }

    //returns a list of files that match the query parameters.
    getFiles = async (request: Request, response: Response) => {
        response.status(501).send("getFiles not implemented yet.")
    }
    //Gets all files.
    getFilesForced = async (request: Request, response: Response) => {
        response.status(501).send("getAllFiles not implemented yet.")
    }

    //Deletes a file.
    deleteFile = async (request: Request, response: Response) => {
        response.status(501).send("deleteFile not implemented yet.")
    }

    //Deletes a file.
    deleteFileForced = async(request: Request, response: Response) => {
        response.status(501).send("deleteFileForced not implemented yet.")
    }

    // Creates a file.
    // Requires a file to be uploaded.
    // Requires a token in the body.
    // Requires a classId in the params.
    // Requires a title in the body.
    createFile = async (request: Request, response: Response) => {
        //Does not yet support multipart uploads, but will.
        //Currently only supports single file uploads (50-35MiB)
        //Post response for this.path for resource this.index.

        const { token } = request.body;
        if(!token){
            return response.status(401).send("Unauthorized");
        }
        let user: User;
        try {
            user = await (new UserService()).getUser({token: token});
            if(!user){
                throw new Error("User not found.");
            }
        } catch (error) {
            return response.status(500).send("Unhandled error.");
        }
        
        let file;
        //Post a file to S3.
        //File should be posted to /username/filename  https://stackoverflow.com/questions/37963906/how-to-get-user-attributes-username-email-etc-using-cognito-identity-id

        //Validate the response
        //console.log("postResource validation not implemented yet.")
        //
        file = request.files.file;
        const filename = file.name;
        //Get filename
        
        console.log(request.files);
        console.log("file: ", file);
        //console.log("filename: ", file);
        //const filename = file.name;
        const fileService = new FileService();
        const local_file_path = await fileService.downloadFile(user.username, file, filename); //should return path of file after its saved.
        console.log("Saved file to: ", local_file_path);
        if(local_file_path == ""){
            return response.status(500).send("Could not download file.");
        }
        
        //Upload file to S3.
        const s3Service = new S3Service();

        let s3_url = await s3Service.uploadFile(user.username, local_file_path, filename);
        console.log("Uploaded file to: ", s3_url);
        //Upon successful upload to S3, delete local file.
        let deleted_file = await fileService.deleteFile(local_file_path);
        if(deleted_file){
            console.log("Deleted file: ", local_file_path);
        }else{
            console.log("Could not delete file: ", local_file_path);
        }
        // while file its being delete, create a MySQL File Entry for the file.
        //Create a MySQL File entry.
        const rdsService = new RDSService();
        let file_id = await rdsService.createFile(user.username, filename, s3_url);
        if(file_id == -1){
            return response.status(500).send("Could not create file entry in MySQL.");
        }
        console.log("Created file entry in MySQL: ", file_id);

        return response.status(200).send("File uploaded successfully."); //should include s3_url and databse id.
    }

    private validateBody(type:string){
        switch(type){
            case 'getFiles':
                return [
                    //?classId
                    //?userId
                    //?fileId
                    //?username
                    //>
                ];
            case 'getFilesForced':
                return [];
            case 'deleteFile':
                return [
                    param('fileId').isInt({min: 1})
                ];
            case 'deleteFileForced':
                return [];
            case 'createFile':
                return [
                    
                ];
        }
    }
}

export default CDNController;