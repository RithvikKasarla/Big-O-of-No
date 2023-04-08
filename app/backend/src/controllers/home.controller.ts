import express, { Request, Response} from 'express';

//Publically accessible.
class HomeController {
    public path = '/';
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        //Get response for this.path for resource this.index.
        // / returns => index.
        this.router.get('', this.index);
    }

    index = (request: Request, response: Response) => {
        response.send('Hello World! -- Home Controller');
    }
}
export default HomeController;