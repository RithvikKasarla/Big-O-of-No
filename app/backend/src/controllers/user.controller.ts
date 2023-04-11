import express, { Request, Response} from 'express';
import AuthMiddleware from '../middleware/auth.middleware';
import { body, query, validationResult } from 'express-validator';
//User service
import UserService from '../services/user.service';
//Cognito service.
import CognitoService from '../services/auth.service';
//These resources are only accessible via Cognito sign in.
class UserController {
    public path = '/user';
    public router = express.Router();
    private authMiddleware: AuthMiddleware;

    constructor() {
        this.authMiddleware = new AuthMiddleware();
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get('/all', this.getUsersForced);
        this.router.use(this.authMiddleware.verifyToken)
        this.router.get('', this.getUsers);
    }
    
    //Given the query parameters, return a list of users.
    //Should eventually support regex.
    public async getUsers(request: Request, response: Response) {
        const result = validationResult(request);
        console.log(request.body)
        //check queries.
        if(!result.isEmpty()){
            return response.status(422).json({message: "Failed, likely invalid input.",errors: result.array()})
        }
        const {classId, userId, username} = request.query;
        if(!classId && !userId && !username){
            return response.status(422).json({message: "Failed, at least one query parameter must be specified. Check if you mispelled the queries (case sensitive).",errors: result.array()})
        }
        const parsedClassId = (classId) ? parseInt(classId.toString()) : -1;
        const parsedUserId = (userId) ? parseInt(userId.toString()) : -1;
        const parsedUsername = (username) ? username.toString() : '';

        //If querying by classId, make sure the user is a member of the class.
        console.warn("ClassID-scope checking not implemented yet.");

        console.log(parsedClassId, parsedUserId, parsedUsername)

        const users = await (new UserService()).getUsers(parsedClassId, parsedUserId, parsedUsername);
        response.status(200).send(users);
        //response.status(501).send("getUsers not implemented yet.")
    }

    //Return a list of all users.
    public async getUsersForced(request: Request, response: Response) {

        const result = validationResult(request);
        console.log(request.body)
        //check queries.
        if(!result.isEmpty()){
            return response.status(401).json({message: "Unauthorized,",errors: result.array()})
        }
        const {classId, userId, username} = request.query;
        const parsedClassId = (classId) ? parseInt(classId.toString()) : -1;
        const parsedUserId = (userId) ? parseInt(userId.toString()) : -1;
        const parsedUsername = (username) ? username.toString() : '';

        console.log(parsedClassId, parsedUserId, parsedUsername)

        const users = await (new UserService()).getUsers(parsedClassId, parsedUserId, parsedUsername);

        
        return response.status(200).send(users);
    }

    private async validateBody(type: string){
        switch(type){
            case 'getUsers':
                return [
                    body('token').exists(),
                    body('token').custom(async (value) => {
                        if((await (new CognitoService()).getUsername(value) ) == ''){
                            throw new Error('Invalid token.');
                        }
                        return true;
                    }),
                    query('classId').optional().isInt({min:1}),
                    query('userId').optional().isInt({min:1}),
                    query('username').optional().isString().notEmpty()
                ];
            case 'getAllUsers':
                return [
                    body('admin_password').exists(),
                    body('admin_password').custom(async (value) => {
                        if(value != process.env.ADMIN_PASSWORD){
                            throw new Error('Invalid admin password.');
                        }
                        return true;
                    }),
                    query('classId').optional().isInt({min:1}),
                    query('userId').optional().isInt({min:1}),
                    query('username').optional().isString().notEmpty()
                ];
            
        }
    }
}

export default UserController;