import * as dotenv from 'dotenv';
dotenv.config();

import * as express from 'express';
import { Request, Response} from 'express';
import { body,param, query, validationResult } from 'express-validator';
import {User, File} from '@prisma/client';
//fileupload
import fileUpload from 'express-fileupload';
import AuthMiddleware from '../middleware/auth.middleware';

//S3 service. 
//Handles all S3 related operations.
import S3Service from '../services/s3.service';
//RDS service. 
//Handles all RDS related operations.
//import RDSService from '../services/rds.service';
//File service.
//Handles all file related operations.
import LocalFileService from '../services/localfs.service';
import FileService from '../services/file.service';
//Cognito service.
//Handles all cognito related operations.
import CognitoService from '../services/auth.service';
import UserService from '../services/user.service';
//Later; Privately accessible, requires cognito.
//for now, publically accessible.
class CDNController{
    public path = '';
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
        //Get files, scoped to the user's classes.
        //Supports query parameters {userId, username, fileId, title}
        // POST URL/file
        this.router.post('/class/:classId/file',this.validateBody('getFiles'),tokenMiddleware, this.getFiles);
        //Delete a file.
        // Does not support query parameters.
        // DELETE URL/class/:classId/file/:fileId
        this.router.delete('/file/:fileId',this.validateBody('deleteFile'),tokenMiddleware, this.deleteFile);
        //Create a file.
        // Does not support query parameters.
        // POST URL/class/:classId/file
        this.router.put('/class/:classId/file',this.validateBody('createFile'),tokenMiddleware, this.createFileChaining);
        //Like a file.
        // Does not support query parameters.
        // POST URL/file/:fileId/like
        this.router.post('/file/:fileId/like',this.validateBody('likeFile'),tokenMiddleware, this.likeFile);
        //Dislike a file.
        // Does not support query parameters.
        // POST URL/file/:fileId/dislike
        this.router.post('/file/:fileId/dislike',this.validateBody('dislikeFile'),tokenMiddleware, this.dislikeFile);
        
    }
    public initializeAdminRoutes() {
        const adminMiddleware = this.authMiddleware.verifyAdmin;
        //Get all files, unscoped.
        // Supports query parameters {classId, userId, username, fileId, file title}
        // POST URL/file/all
        this.router.post('/file',this.validateBody('getFilesForced'),adminMiddleware, this.getFilesForced);
        //Delete a file forcibly.
        // Does not support query parameters.
        // DELETE URL/file/all/:fileId
        this.router.delete('/file/all/:fileId',this.validateBody('deleteFileForced'),adminMiddleware, this.deleteFileForced);
    }
    
    //returns a list of files that match the query parameters.
    getFiles = async (request: Request, response: Response) => {
        //Determine the queries.
        const {classId} = request.params;
        //Determine the user's class scope.
        //const {token} = request.body;
        //const userService = new UserService();
        //const user:User = await userService.getUser({ token: token.toString() });
        //Build params from queries.
        const fileSearchParams = {
            classId: parseInt(classId),
            ...(request.query.userId) ? {userId: parseInt(request.query.userId.toString())} : {},
            ...(request.query.username) ? {username: request.query.username.toString()} : {},
            ...(request.query.fileId) ? {fileId: parseInt(request.query.fileId.toString())} : {},
        }
        //Get the files.
        const fileService = new FileService();
        try {
            const files:File[] = await fileService.getFiles(fileSearchParams);
            return response.status(200).send({ message: "Successfully retrieved files.", files: files });
        } catch (error) {
            return response.status(500).send({ message: "File Service error.", error: error });
        }
    }
    //Gets all files.
    getFilesForced = async (request: Request, response: Response) => {
        const fileSearchParams = {
            ...(request.query.classId) ? {classId: parseInt(request.query.classId.toString())} : {},
            ...(request.query.userId) ? {userId: parseInt(request.query.userId.toString())} : {},
            ...(request.query.username) ? {username: request.query.username.toString()} : {},
            ...(request.query.fileId) ? {fileId: parseInt(request.query.fileId.toString())} : {},
            ...(request.query.title) ? {title: request.query.title.toString()} : {},
        }

        const fileService = new FileService();
        try {
            const files:File[] = await fileService.getFiles(fileSearchParams);
            return response.status(200).send({ message: "Successfully retrieved files.", files: files });
        } catch (error) {
            return response.status(500).send({ message: "File Service error.", error: error });
        }
    }
    
    //Deletes a file.
    deleteFile = async (request: Request, response: Response) => {

        const {fileId} = request.params;
        const {token} = request.body;
        try {
            //if user.id == file.authorId
            const fileService = new FileService();
            const userService = new UserService();
            const user:User = await userService.getUser({ token: token.toString() });
            const files:File[] = await fileService.getFiles({fileId: parseInt(fileId)});
            const file:File = files[0];
            console.log(`File: ${JSON.stringify(file)}`)
            if(user.id != file.authorId){
                return response.status(401).send({ message: "Unauthorized.", error: "User does not own file." });
            }
            let deletedFile:File = await fileService.deleteFile({fileId: file.id});

            return response.status(200).send({ message: "Successfully deleted file.", file: deletedFile });
        } catch (error) {
            return response.status(500).send({ message: "File Service error.", error: error.message });
        }
    }
    
    //Deletes a file.
    deleteFileForced = async(request: Request, response: Response) => {
        const {fileId} = request.params;
        const {token} = request.body;
        try {
            
            const fileService = new FileService();
            //const userService = new UserService();
            //const user:User = await userService.getUser({ token: token.toString() });
            const file:File = (await fileService.getFiles({fileId: parseInt(fileId)}))[0];
            let deletedFile:File = await fileService.deleteFile({fileId: file.id});

            return response.status(200).send({ message: "Successfully deleted file.", file: deletedFile });
        } catch (error) {
            return response.status(500).send({ message: "File Service error.", error: error });
        }
    }
    
    
    
    
    
    createFileChaining = async (request: Request, response: Response) => {
        
        const file = request.files.file;
        if(!file){
            return response.status(400).send("No file was uploaded.");
        }
        let filename = file['name'];
        //Replace spaces with underscores.
        filename = filename.replace(/ /g, "_");
        const {token} = request.body;
        const title:string = request.body.title;
        const {classId} = request.params;
        try {
            const userService = new UserService();
            const user:User = await userService.getUser({ token: token.toString() });
            console.log("user: ", user.username);
            
            const localFileService = new LocalFileService();
            const localFilePath:string = localFileService.downloadFile(user.username, file, filename);
            
            const s3Service = new S3Service();
            const savedS3Url:string = await s3Service.uploadFile(user.username, localFilePath, filename);
            console.log("s3_url: ", savedS3Url);
            
            const fileService = new FileService();
            const rdsFile:File = await fileService.createFile({ title: title, s3_url: savedS3Url, classId: parseInt(classId), authorId: user.id });
            console.log("file: ", rdsFile.title);
            
            const fileId = rdsFile.id;
            if (!fileId) {
                return response.status(500).send({ message: "File Service error.", error: "File ID not returned." });
            }
            
            return response.status(200).send({ message: "Successfully uploaded file EFR", params: { classId: classId, fileId: fileId, s3_url: savedS3Url, title: title } });
        } catch (err) {
            // Catch and handle errors
            console.log(err);
            return response.status(500).json({ message: "Error occurred.", error: err.message });
        }
    }
    likeFile = async (request: Request, response: Response) => {
        const {fileId} = request.params;
        const {token} = request.body;
        
        try {
            const fileService = new FileService();
            const userService = new UserService();
            const user:User = await userService.getUser({ token: token.toString() });
            const files:File[] = await fileService.getFiles({fileId: parseInt(fileId)});
            const file:File = files[0];
            let likedFile:File = await fileService.likeFile({fileId: file.id, userId: user.id});

            return response.status(200).send({ message: "Successfully liked file.", file: likedFile });
        } catch (error) {
            return response.status(500).send({ message: "File Service error.", error: error });
        }
    }
    dislikeFile = async (request: Request, response: Response) => {
        const {fileId} = request.params;
        const {token} = request.body;
        
        try {
            const fileService = new FileService();
            const userService = new UserService();
            const user:User = await userService.getUser({ token: token.toString() });
            const files:File[] = await fileService.getFiles({fileId: parseInt(fileId)});
            const file:File = files[0];
            let dislikedFile:File = await fileService.dislikeFile({fileId: file.id, userId: user.id});

            return response.status(200).send({ message: "Successfully disliked file.", file: dislikedFile });
        } catch (error) {
            return response.status(500).send({ message: "File Service error.", error: error });
        }
    }

    private validateBody(type:string){
        switch(type){
            case 'getFiles':
            return [
                param('classId').optional().isInt({min: 1}),
                query('userId').optional().isInt({min: 1}),
                query('username').optional().isString().isLength({min: 1, max: 255}),
                query('fileId').optional().isInt({min: 1}),
                query('title').optional().isString().isLength({min: 1, max: 255}),
            ];
            case 'getFilesForced':
            return [
                query('classId').optional().isInt({min: 1}),
                query('userId').optional().isInt({min: 1}),
                query('username').optional().isString().isLength({min: 1, max: 255}),
                query('fileId').optional().isInt({min: 1}),
                query('title').optional().isString().isLength({min: 1, max: 255}),
            ];
            case 'deleteFile':
            return [
                param('classId').isInt({min: 1}),
                param('fileId').isInt({min: 1})
            ];
            case 'deleteFileForced':
            return [
                param('fileId').isInt({min: 1})
            ];
            case 'createFile':
            return [
                body('title').isString().isLength({min: 1, max: 255}),
                param('classId').isInt({min: 1}),
            ];
            case 'likeFile':
            return [
                param('fileId').isInt({min: 1})
            ];
            case 'dislikeFile':
            return [
                param('fileId').isInt({min: 1})
            ];

        }
    }
}

export default CDNController;