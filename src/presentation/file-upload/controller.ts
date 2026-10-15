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

        const files= req.files;
        
        if(!req.files||Object.keys(req.files).length===0){
            return res.status(400).json({error:'No files were Selected'})
        }

        const file = req.files.file as UploadedFile;
        
        this.fileUploadService.uploadSingle(file)
            .then(uploaded=>res.json(uploaded))
            .catch(error=>this.handleError(error,res));
    }

  uploadMultipleFile = async(req:Request,res:Response)=>{


    }

}