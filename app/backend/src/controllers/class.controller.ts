import * as dotenv from 'dotenv';
dotenv.config();


import express, { Request, Response} from 'express';
import AuthMiddleware from '../middleware/auth.middleware';
import { body, query, validationResult } from 'express-validator';

import CognitoService from '../services/auth.service';

import RDSService from '../services/rds.service';

//Publically accessible.
class ClassController {
    public path = '/class';
    public router = express.Router();
    private authMiddleware: AuthMiddleware;
    constructor() {
        this.authMiddleware = new AuthMiddleware();
        this.initializeRoutes();
    }

    public async initializeRoutes() {
        this.router.use(this.authMiddleware.verifyToken);
        this.router.get('', await this.validateBody('getClasses'), this.getClasses);

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
        const {classId} = request.query;
        if(!classId){
            return response.status(422).json({message: "Failed, at least one query parameter must be specified. Check if you mispelled the queries (case sensitive).",errors: result.array()})
        }
    }
    //Get ALL classes.
    //Admin only.
    getAllClasses = async (request: Request, response: Response) => {}

    //join a class.
    //Token is required.
    joinClass = async (request: Request, response: Response) => {}
    
    //leave a class.
    //Token is required.
    leaveClass = async (request: Request, response: Response) => {}

    //Create a new class.
    //Admin only.
    createClass = async (request: Request, response: Response) => {}

    //edit a class.
    //Admin only.
    editClass = async (request: Request, response: Response) => {}

    //delete a class.
    //Admin only.
    deleteClass = async (request: Request, response: Response) => {}

    private async validateBody(type: string) {
        switch(type) {
            case 'getClasses':
                return [
                    query('classId').optional().isInt({min:1})
                ];
            case 'getAllClasses':
                return [];
            case 'joinClass':
                return [];
            case 'leaveClass':
                return [];
            case 'createClass':
                return [];
            case 'editClass':
                return [];
            case 'deleteClass':
                return [];
        }
    }
}
export default ClassController;