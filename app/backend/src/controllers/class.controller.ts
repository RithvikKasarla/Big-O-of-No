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
        // Adds user to class.
        this.router.put('/:classId', this.joinClass);
        // Leave class.
        this.router.post('/:classId', this.leaveClass);
        // Adds the routes that pertain to posts.
        this.router.use('/:classId/posts', new PostController().router);

    }
    //Requires token.
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
        const rds = new RDSService();
        const classes = await rds.getUserClasses(username);
        //return classes.
        return response.status(200).send(classes);
    }
    //Requires admin password.
    //Requires class name.
    //Requires class description.
    postClass = async (request: Request, response: Response) => {
        const {admin_password, class_name, class_description} = request.body;
        //check admin password.
        if(admin_password != process.env.HOST_ADMIN_PASSWORD){
            return response.status(401).send("Unauthorized, invalid admin password provided.");
        }
        //check class name.
        if(class_name == ''){
            return response.status(400).send("Bad Request, class name cannot be empty.");
        }
        //Make sure theres no class with the same name.
        const rds = new RDSService();

        //create class in RDS.
        
        const new_class = await rds.createClass(class_name, class_description);
        if(!new_class){
            return response.status(500).send("Internal Server Error, could not create class.");
        }
        return response.status(200).send("Class created successfully.");
        //return class.
    }

    //joinclass
    //Requires token.
    //Requires class id.
    joinClass = async (request: Request, response: Response) => {
        const { classId } = request.params;
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
        //get class from RDS.
        const rds = new RDSService();
        if(!await rds.classExists(parseInt(classId))){
            return response.status(400).send("Bad Request, class does not exist.");
        }
        //add user to class.
        if(!await rds.addUserToClass(username, parseInt(classId))){
            return response.status(500).send("Internal Server Error, could not add user to class.");
        }else{
            return response.status(200).send("User added to class successfully.");
        }
    }
    //leaveclass
    //Requires token.
    //Requires class id.
    leaveClass = async (request: Request, response: Response) => {
    }
}
export default ClassController;