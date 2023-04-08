import express, { Request, Response} from 'express';
import AuthMiddleware from '../middleware/auth.middleware';


//These resources are only accessible via Cognito sign in.
class ProtectedController {
    public path = '/protected';
    public router = express.Router();
    private authMiddleware: AuthMiddleware;

    constructor() {
        this.authMiddleware = new AuthMiddleware();
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.use(this.authMiddleware.verifyToken)
        //Get response for this.path for resource this.index.
        // /protected returns => index.
        this.router.get('', this.index);
        //Get response for this.path for resource 'secret'.
        // /protected/secret returns => secret.
        this.router.get('/secret', this.secret);
    }
    index = (request: Request, response: Response) => {
        response.send('Hello World! -- Protected Controller');
    }
    secret = (request: Request, response: Response) => {
        response.send('deez nuts.');
    }
}
export default ProtectedController;