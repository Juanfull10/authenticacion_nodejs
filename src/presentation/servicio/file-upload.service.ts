import { UploadedFile } from "express-fileupload";
import  fs  from "fs";
import path from "path";
import { uuid } from "../../config/uuid";
import { CustomError } from "../../domain";



export class fileUploadService{
    constructor(
        private readonly Uuid = uuid.v4
    ){}

    private checkFolder(folderPath:string){
        if(!fs.existsSync(folderPath)){
            fs.mkdirSync(folderPath);
        }
    }

    async uploadSingle(
        file:UploadedFile,
        folder:string='uploads',
        validExtensions:string[]=['png','jpg','jpeg','gif']
    ){
       try {
        
        const fileExtension=file.mimetype.split('/').at(1)??'';

        if(!validExtensions.includes(fileExtension))throw CustomError.badRequest(`Invalid extension: ${fileExtension},valid ones ${validExtensions}`);

        const destination= path.resolve(__dirname,'../../../',folder);
        this.checkFolder(destination);
        const fileName = `${this.Uuid()}.${fileExtension}`;

        file.mv(`${destination}/${fileName}`);

        return {fileName};

       } catch (error) {
            console.log({error})
            throw error;
       }

    } 
    async uploadMultiple(
        files:UploadedFile[],
        folder:string='uploads',
        validExtensions:string[]=['png','jpg','jpeg','gif']
    ){

        const fileNames= await Promise.all(
            files.map(file=>this.uploadSingle(file,folder,validExtensions))
        );

        return fileNames; 
    }

}