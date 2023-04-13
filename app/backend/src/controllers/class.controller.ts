import * as dotenv from 'dotenv';
dotenv.config();


import express, { Request, Response} from 'express';
import AuthMiddleware from '../middleware/auth.middleware';
import { body, param, query, validationResult } from 'express-validator';

import CognitoService from '../services/auth.service';

//import RDSService from '../services/rds.service';
import ClassService from '../services/class.service';
import UserService from '../services/user.service';
//Publically accessible.
class ClassController {
    public path = '/class';
    public router = express.Router();
    private authMiddleware: AuthMiddleware;
    constructor() {
        this.authMiddleware = new AuthMiddleware();
        this.initializeTokenRoutes();
        this.initializeAdminRoutes();
    }

    public async initializeTokenRoutes() {
        const tokenMiddleware = this.authMiddleware.verifyToken;
        //this.router.use(this.authMiddleware.verifyToken); //All functions after this require a token.
        this.router.post('', await this.validateBody('getClasses'),tokenMiddleware, this.getClasses);
        this.router.put('/:classId/join', await this.validateBody('joinClass'),tokenMiddleware, this.joinClass);
        this.router.put('/:classId/leave', await this.validateBody('leaveClass'),tokenMiddleware, this.leaveClass);
        this.router.post('/all', await this.validateBody('getClassesForced'),tokenMiddleware, this.getClassesForced);
    }
    public async initializeAdminRoutes() {
        const adminMiddleware = this.authMiddleware.verifyAdmin;
        //this.router.use(this.authMiddleware.verifyAdmin) //All functions after this require admin.
        this.router.put('', await this.validateBody('createClass'),adminMiddleware, this.createClass);
        this.router.delete('/:classId', await this.validateBody('deleteClass'),adminMiddleware, this.deleteClass);
    }
    //Gets a list of classes. Defaults to all the classes that the user has access to.
    //Supported Query Parameters: ?classId
    getClasses = async (request: Request, response: Response) => {
        const result = validationResult(request);
        console.log(request.body)
        //check queries.
        if(!result.isEmpty()){
            return response.status(422).json({message: "Failed, likely invalid input.",errors: result.array()})
        }
        
        const {token} = request.body;        
        //getClasses is scoped, must always include username.
        const username = await (new CognitoService()).getUsername(token);
        //construsct the request params.
        let classServiceRequestParams = {
            ...(request.query.classId ? {classId: parseInt(request.query.classId.toString())} : {}),
            ...(username ? {username: username.toString()} : {})
        };
        
        try {
            const classes = await (new ClassService()).getClasses(classServiceRequestParams);
            return response.status(200).send(classes);
        } catch (error) {
            return response.status(500).json({message: error.message});
        }
    }
    //Get ALL classes.
    //Admin only.
    //Supported Query Parameters: ?classId, ?userId, ?username, 
    getClassesForced = async (request: Request, response: Response) => {
        const result = validationResult(request);
        console.log(request.body)
        //check queries.
        if(!result.isEmpty()){
            return response.status(422).json({message: "Failed, likely invalid input.",errors: result.array()})
        }
        //construsct the request params.
        let classServiceRequestParams = {
            ...(request.query.classId ? {classId: parseInt(request.query.classId.toString())} : {}),
            ...(request.query.userId ? {userId: parseInt(request.query.userId.toString())} : {}),
            ...(request.query.username ? {username: request.query.username.toString()} : {})
        };
        
        try {
            const classes = await (new ClassService()).getClasses(classServiceRequestParams);
            return response.status(200).send(classes);
        } catch (error) {
            return response.status(500).json({message: error.message});
        }
        
    }

    //join a class.
    //Token is required.
    //Adds the user to the class
    joinClass = async (request: Request, response: Response) => {
        const result = validationResult(request);
        console.log(request.body)
        //check queries.
        if(!result.isEmpty()){
            return response.status(422).json({message: "Failed, likely invalid input.",errors: result.array()})
        }
        const {token} = request.body;        
        //getClasses is scoped, must always include username.
        let userId:number;
        try {
            const user = await (new UserService()).getUser({token: token.toString()});
            userId = user.id;
            console.log("USERID: " + userId);
        } catch (error) {
            console.log(error.message)
            return response.status(401).json({message: error.message});
        }
        //construsct the request params.
        let classServiceRequestParams = {
            classId: parseInt(request.params.classId.toString()),
            userId: userId
        };
        try {
            await (new ClassService()).joinClass(classServiceRequestParams);
            return response.status(200).send({'message': 'Success'});
        } catch (error) {
            if(error.message === 'Class does not exist.') {
                return response.status(404).json({message: "Class does not exist."});
            }else{
                return response.status(500).json({message: error.message});
            }
        }
    }
    
    //leave a class.
    //Token is required.
    leaveClass = async (request: Request, response: Response) => {
        const result = validationResult(request);
        console.log(request.body)
        //check queries.
        if(!result.isEmpty()){
            return response.status(422).json({message: "Failed, likely invalid input.",errors: result.array()})
        }
        const {token} = request.body;        
        //getClasses is scoped, must always include username.
        let userId:number;
        try {
            const user = await (new UserService()).getUser({token: token.toString()});
            userId = user.id;
            console.log("USERID: " + userId);
        } catch (error) {
            console.log(error.message)
            return response.status(401).json({message: error.message});
        }
        //construsct the request params.
        let classServiceRequestParams = {
            classId: parseInt(request.params.classId.toString()),
            userId: userId
        };

        try {
            await (new ClassService()).leaveClass(classServiceRequestParams);
            return response.status(200).send({'message': 'Success'});
        } catch (error) {
            return response.status(500).json({message: error.message});
        }
    }

    //Create a new class.
    //Admin only.
    createClass = async (request: Request, response: Response) => {
        const result = validationResult(request);
        console.log(request.body)
        //check queries.
        if(!result.isEmpty()){
            return response.status(422).json({message: "Failed, likely invalid input.",errors: result.array()})
        }     
        
        //construct the request params.
        let classServiceRequestParams = {
            name: request.body.class_name.toString(),
            ...(request.body.class_description ? {description: request.body.class_description.toString()} : {}),
        };
        try {
            const classes = await (new ClassService()).createClass(classServiceRequestParams);
            return response.status(200).send(classes);
        } catch (error) {
            if(error.message === 'Class already exists.') {
                return response.status(409).json({message: error.message});
            }else if (error.message === 'A valid name is required.') {
                return response.status(422).json({message: error.message});
            }else{
                return response.status(500).json({message: error.message});
            }
        }


    }

    //edit a class.
    //Admin only.
    editClass = async (request: Request, response: Response) => {
        
    }

    //delete a class.
    //Admin only.
    deleteClass = async (request: Request, response: Response) => {
        const result = validationResult(request);
        console.log(request.body)
        //check queries.
        if(!result.isEmpty()){
            return response.status(422).json({message: "Failed, likely invalid input.",errors: result.array()})
        }
        let classServiceRequestParams = {
            classId: parseInt(request.params.classId.toString()),
        };

        try {
            await (new ClassService()).deleteClass(classServiceRequestParams);
            return response.status(200).send({'message': 'Success'});
        } catch (error) {
            return response.status(500).json({message: error.message});
        }
    }

    private async validateBody(type: string) {
        switch(type) {
            case 'getClasses':
                return [
                    query('classId').optional().isInt({min:1})
                ];
            case 'getClassesForced':
                return [
                    query('classId').optional().isInt({min:1}),
                    query('userId').optional().isInt({min:1}),
                    query('username').optional().isString()
                ];
            case 'joinClass':
                return [
                    param('classId').isInt({min:1})
                ];
            case 'leaveClass':
                return [
                    param('classId').isInt({min:1})
                ];
            case 'createClass':
                return [
                    body('class_name').isString().notEmpty(),
                    body('class_description').optional().isString().notEmpty(),
                ];
            case 'editClass':
                return [];
            case 'deleteClass':
                return [
                    param('classId').isInt({min:1})
                ];
        }
    }
}
export default ClassController;