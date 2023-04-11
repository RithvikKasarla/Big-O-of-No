import App from './app';
import bodyParser from 'body-parser';



//auth controller
import AuthController from './controllers/auth.controller';
//class controller
import ClassController from './controllers/class.controller';
//comment controller
import CommentController from './controllers/comment.controller';
//file controller
import FileController from './controllers/file.controller';
//user controller
import UserController from './controllers/user.controller';



const app = new App({
    port: 3000,
    controllers: [
        new AuthController(),
        new ClassController(),
        new CommentController(),
        new FileController(),
        new UserController(),
        
    ],
    middlewares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
    ],
});

app.listen();