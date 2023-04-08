import express from 'express';
import { Application } from 'express';



import fileUpload from 'express-fileupload';

class App {
    public app: Application;
    public port: number;

    constructor(appInit: {port:number, middlewares: any, controllers: any}) {
        this.app = express();
        this.port = appInit.port;
        this.app.use(fileUpload());
        //applies any middleware declared in server.ts
        this.middlewares(appInit.middlewares);
        //applies any controller declared in server.ts
        this.routes(appInit.controllers);

    }

    public listen(){
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
    //needs to be called in constructor.
    private routes(controllers: any) {
        //Constructs routes.
        controllers.forEach(controller => {
            this.app.use(controller.path, controller.router);
        });
    }
    //needs to be called in constructor.
    private middlewares(middlewares: any) {
        //Constructs middlewares.
        middlewares.forEach(middleware => {
            this.app.use(middleware);
        });
    }
}

export default App;