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
        this.initializeAdminRoutes();
        this.initializeTokenRoutes();
    }

    public async initializeTokenRoutes() {
        const tokenMiddleware = this.authMiddleware.verifyToken;
        //this.router.use(this.authMiddleware.verifyToken) //All functions after this require a token.
        this.router.post('', await this.validateBody('getUsers'),tokenMiddleware, this.getUsers);
    }
    public async initializeAdminRoutes() {
        const adminMiddleware = this.authMiddleware.verifyAdmin;
        //this.router.use(this.authMiddleware.verifyAdmin) //All functions after this require admin.
        this.router.post('/all', await this.validateBody('getUsersForced'),adminMiddleware, this.getUsersForced);
    }
    
    //Given the query parameters, return a list of users.
    //Should eventually support regex.
    public async getUsers(request: Request, response: Response) {
        try {
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
    
            //If querying by classId, make sure the user is a member of the class.
            console.warn("ClassID-scope checking not implemented yet.");
            //if(not in classId){return 401}
    
            let getUsersParams = await {
                ...(classId) ? {classId: parseInt(classId.toString())} : {},
                ...(userId) ? {userId: parseInt(userId.toString())} : {},
                ...(username) ? {username: username.toString()} : {}
            }
            try {
                const users = await (new UserService()).getUsers(getUsersParams);
                return response.status(200).send(users);
            } catch (error) {
                return response.status(500).send(error.message);
            }
        } catch (error) {
            return response.status(500).json({message: "Unhandeled error.", error: error.message});
        }
        //response.status(501).send("getUsers not implemented yet.")
    }

    //Return a list of all users.
    public async getUsersForced(request: Request, response: Response) {
        try {
            const result = validationResult(request);
            console.log(request.body)
            //check queries.
            if(!result.isEmpty()){
                return response.status(401).json({message: "Unauthorized,",errors: result.array()})
            }
            const {classId, userId, username} = request.query;
            const { token } = request.body;
            let getUsersParams = await {
                ...(classId) ? {classId: parseInt(classId.toString())} : {},
                ...(userId) ? {userId: parseInt(userId.toString())} : {},
                ...(username) ? {username: username.toString()} : {},
                ...(token) ? {token: token.toString()} : {}
            };
            try {
                const users = await (new UserService()).getUsers(getUsersParams);
                return response.status(200).send(users);
            } catch (error) {
                return response.status(500).send(error.message);
            }
        } catch (error) {
            return response.status(500).json({message: "Unhandeled error.", error: error.message});
        }
    }

    private async validateBody(type: string){
        switch(type){
            case 'getUsers':
                return [
                    query('classId').optional().isInt({min:1}),
                    query('userId').optional().isInt({min:1}),
                    query('username').optional().isString().notEmpty()
                ];
            case 'getUsersForced':
                return [
                    query('classId').optional().isInt({min:1}),
                    query('userId').optional().isInt({min:1}),
                    query('username').optional().isString().notEmpty()
                ];
            
        }
    }
}

export default UserController;