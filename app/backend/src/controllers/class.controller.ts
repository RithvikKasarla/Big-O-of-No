import * as dotenv from 'dotenv';
dotenv.config();


import express, { Request, Response} from 'express';
import AuthMiddleware from '../middleware/auth.middleware';

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

    public initializeRoutes() {
        

    }
    //Given the query parameters, return a list of classes.
    //Token is required.
    getClasses = async (request: Request, response: Response) => {}

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
}
export default ClassController;