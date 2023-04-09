import express, { Request, Response } from 'express';

import RDSService from '../services/rds.service';

import CognitoService from '../services/cognito.service';

class PostController {
    public path = '/class/:classId/posts'; // Define the path for posts route
    public router = express.Router();
    
    constructor() {
        this.initializeRoutes();
    }
    
    public initializeRoutes() {
        // Get response for this.path for resource this.classPosts.
        this.router.get('', this.getPosts);
        // Create a new post.
        this.router.post('', this.createPost);
    }
    
    getPosts = (request: Request, response: Response) => {
        // Retrieve classId from the request parameters
        const { classId } = request.params;
        // Return posts for the given classId
        const rds = new RDSService();
        const posts = rds.getClassPosts(classId);
        
        return response.send(posts);
    }
    
    //Requires token.
    createPost = async (request: Request, response: Response) => {
        // Retrieve classId from the request parameters
        const { classId} = request.params;
        const  {title, token, content } = request.body;
        // Get username from cognito.
        const cognito = new CognitoService();
        const username = await cognito.getUsername(token);
        //Validate username, classId, title, and content
        //title, author, 

        //Make sure the user is a member of the class
        const rds = new RDSService();
        const isMember = await rds.isMember(username, parseInt(classId));
        if(!isMember){
            return response.status(401).send("Unauthorized, user is not a member of the class.");
        }
        // Create a new post for the given classId
        
        const post = await rds.createPost(title, username, parseInt(classId), content)
        
        return response.send(post);
    };
    // Add other methods for handling posts, e.g. createPost, updatePost, etc.
    // ...
}

export default PostController;