import express, { Request, Response} from 'express';
import AuthMiddleware from '../middleware/auth.middleware';


//These resources are only accessible via Cognito sign in.
class CommentController {
    public path = '/comment';
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
    }
    public initializeAdminRoutes() {
        const adminMiddleware = this.authMiddleware.verifyAdmin;
        //this.router.use(this.authMiddleware.verifyAdmin) //All functions after this require admin.
    }
    //Given the query parameters, return a list of comments.
    //Token is required.
    //Scoped to class.
    getComments = async (request: Request, response: Response) => {
        
    }

    //Get ALL comments.
    //Admin only.
    getAllComments = async (request: Request, response: Response) => {}

    //Create a new comment.
    //Token is required.
    //Scoped to class.
    createComment = async (request: Request, response: Response) => {}

    //edit a comment.
    //Token is required.
    //Scoped to comment owner.
    editComment = async (request: Request, response: Response) => {}

    //delete a comment.
    //Token is required.
    //Scoped to comment owner.
    deleteComment = async (request: Request, response: Response) => {}

    //force delete a comment.
    //Admin only.
    forceDeleteComment = async (request: Request, response: Response) => {}
}
export default CommentController;