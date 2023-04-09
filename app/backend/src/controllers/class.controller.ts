import * as dotenv from 'dotenv';
dotenv.config();


import express, { Request, Response} from 'express';
import AuthMiddleware from '../middleware/auth.middleware';

import PostController from './post.controller';

import CognitoService from '../services/cognito.service';

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
        // create a new class, requires adminassword. 
        this.router.post('', this.postClass);
        //Only accessible to registered users. 
        this.router.use(this.authMiddleware.verifyToken)
        // return a list of classes that the user is part of.
        this.router.get('', this.getClass);
        // Adds the routes that pertain to posts.
        this.router.use('/:classId/posts', new PostController().router);

    }
    
    getClass = async (request: Request, response: Response) => {
        //return a json of all classes that the user is in.
        //Should include class ids.
        const { token } = request.body;
        if(!token){
            return response.status(401).send("Unauthorized, no token provided.");
        }
        //get username from cognito.
        const cognito = new CognitoService();
        const username = await cognito.getUsername(token);
        if(username == ''){ //shouldn't have to do this getUsername should eventually be able to return errors.
            return response.status(401).send("Unauthorized, invalid token provided.");
        }
        //get classes from RDS.

        //return classes.
    }
    postClass = async (request: Request, response: Response) => {
        const {admin_password, class_name, class_description} = request.body;
        //check admin password.
        if(admin_password != process.env.HOST_ADMIN_PASSWORD){
            return response.status(401).send("Unauthorized, invalid admin password provided.");
        }
        //create class in RDS.
        const rds = new RDSService();
        const new_class = await rds.createClass(class_name, class_description);
        if(!new_class){
            return response.status(500).send("Internal Server Error, could not create class.");
        }
        return response.status(200).send("Class created successfully.");
        //return class.
    }
}
export default ClassController;