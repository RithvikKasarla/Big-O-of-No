import express, { Request, Response} from 'express';
import AuthMiddleware from '../middleware/auth.middleware';


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
        

        this.router.use(this.authMiddleware.verifyToken)
        
    }
    
    //Given the query parameters, return a list of users.
    public async getUsers(request: Request, response: Response) {}

    //Return a list of all users.
    public async getAllUsers(request: Request, response: Response) {}

    //Return a user object.
    public async getUser(request: Request, response: Response) {}

}

export default UserController;