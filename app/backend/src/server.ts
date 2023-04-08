import App from './app';
import bodyParser from 'body-parser';

//Control for Home Controller
import HomeController from './controllers/home.controller';
//Control for Auth Controller
import AuthController from './controllers/auth.controller';
//Control for Protected Controller
import ProtectedController from './controllers/protected.controller';
//Control for CDN Controller
import CDNController from './controllers/cdn.controller';
const app = new App({
    port: 3000,
    controllers: [
        new HomeController(),
        new AuthController(),
        new ProtectedController(),
        new CDNController(),
    ],
    middlewares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
    ],
});

app.listen();