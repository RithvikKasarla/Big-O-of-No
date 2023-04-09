import express, { Request, Response } from 'express';

import RDSService from 'services/rds.service';

class PostController {
    public path = '/class/:classId/posts'; // Define the path for posts route
    public router = express.Router();
    
    constructor() {
        this.initializeRoutes();
    }
    
    public initializeRoutes() {
        // Get response for this.path for resource this.classPosts.
        this.router.get('', this.getPosts);
        // Add other routes for handling posts, e.g. creating a new post, updating a post, etc.
        // ...
    }
    
    getPosts = (request: Request, response: Response) => {
        // Retrieve classId from the request parameters
        const { classId } = request.params;
        // Return posts for the given classId
        const rds = new RDSService();
        const posts = rds.getClassPosts(classId);
        
        return response.send(posts);
    }
    
    creatPost = (request: Request, response: Response) => {
        // Retrieve classId from the request parameters
        const { classId } = request.params;
        // Create a new post for the given classId
        const rds = new RDSService();
        const post = rds.createPost(classId, request.body);
        
        return response.send(post);
    };
    // Add other methods for handling posts, e.g. createPost, updatePost, etc.
    // ...
}

export default PostController;