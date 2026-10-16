import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { fileUploadService } from "../servicio/file-upload.service";
import { UploadedFile } from "express-fileupload";




export class fileUploadController{

    constructor(
               private readonly fileUploadService:fileUploadService
    ){}

    private handleError=(error:unknown,res:Response)=>{
            if(error instanceof CustomError){
                return res.status(error.statusCode).json({error:error.message});
            }
    
            console.log(`${error}`)
            return res.status(500).json({error:'Internal server error'});
    }
    
    uploadFile = async(req:Request,res:Response)=>{

        const type=req.url.split('/').at(2)??'';
        const file = req.body.files.at(0) as UploadedFile;
        
        this.fileUploadService.uploadSingle(file,`uploads/${type}`)
            .then(uploaded=>res.json(uploaded))
            .catch(error=>this.handleError(error,res));
    }

  uploadMultipleFile = async(req:Request,res:Response)=>{


        const type=req.url.split('/').at(2)??'';
        const files = req.body.files as UploadedFile[];
        
        this.fileUploadService.uploadMultiple(files,`uploads/${type}`)
            .then(uploaded=>res.json(uploaded))
            .catch(error=>this.handleError(error,res));

    }

}