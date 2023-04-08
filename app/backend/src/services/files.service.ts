import * as dotenv from 'dotenv';
dotenv.config();

//fs
import fs from 'fs';
//Handles the management of local files.
class FileService{
    private config = {

    }

    constructor() {

    }
    
    //Downloads a file
    //should return path of file after its saved.
    public downloadFile(username:string, file: any, filename: string): string {
        // __dirname + process.env.DOWNLOAD_PATH + username + "/" + file.name;
        const save_path = `${process.cwd()}/${process.env.DOWNLOAD_PATH}/${username}/${file.name}`
        console.log(`save_path: ${save_path}`);

        //check if the folder `${process.cwd()}/${process.env.DOWNLOAD_PATH}` exists
        //if not, create it.
        if(!fs.existsSync(`${process.cwd()}/${process.env.DOWNLOAD_PATH}`)){
            console.log(`Download folder: ${process.cwd()}/${process.env.DOWNLOAD_PATH} does not exist. Creating...`)
            fs.mkdirSync(`${process.cwd()}/${process.env.DOWNLOAD_PATH}`);
        }
        //check if the folder `${process.cwd()}/${process.env.DOWNLOAD_PATH}/${username}` exists
        if(!fs.existsSync(`${process.cwd()}/${process.env.DOWNLOAD_PATH}/${username}`)){
            console.log(`Download folder: ${process.cwd()}/${process.env.DOWNLOAD_PATH}/${username} does not exist. Creating...`)
            fs.mkdirSync(`${process.cwd()}/${process.env.DOWNLOAD_PATH}/${username}`);
        }
        //if not, create it.


        file.mv(save_path, (err) => {
            if (err) {
                console.log(err);
                return "";
            }
        });

        return save_path;
        
    }

    public deleteFile(local_file_path: string): boolean {
        const base_path = `${process.cwd()}/${process.env.DOWNLOAD_PATH}`;

        //ensure local_file_path is a child of base_path
        if(!local_file_path.startsWith(base_path)){
            console.error(`FileService.deleteFile: local_file_path is not a child of base_path, COULD BE MALICIOUS!`);
            throw new Error(`FileService.deleteFile: local_file_path is not a child of base_path, COULD BE MALICIOUS!`);
        }

        //check if file exists
        fs.access(local_file_path, fs.constants.F_OK, (err) => {
            if(err){
                console.error(`FileService.deleteFile: File does not exist!`);
                return false;
            } else {
                //delete file
                fs.unlink(local_file_path, (err) => {
                    if(err){
                        console.error(`FileService.deleteFile: Error deleting file!`);
                        return false;
                    }
                });
                //delete parent directory 
            }
        });
        
        return true;
    }
}

export default FileService;