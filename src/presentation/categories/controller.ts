import { Request, Response } from "express";
import { createCategoryDto, CustomError } from "../../domain";
import { categoryServices } from "../servicio/category.service";




export class CategoryController{

    constructor(
           public readonly categoryServices:categoryServices
    ){}

    private handleError=(error:unknown,res:Response)=>{
            if(error instanceof CustomError){
                return res.status(error.statusCode).json({error:error.message});
            }
    
            console.log(`${error}`)
            return res.status(500).json({error:'Internal server error'});
    }
    
    createCategory = async(req:Request,res:Response)=>{

        const [error,createCategorydto]= createCategoryDto.create(req.body);
         if(error)return res.status(400).json({error});
      
        this.categoryServices.createCategory(createCategorydto!,req.body.user)
            .then(category=>res.status(201).json(category))
            .catch(error=>this.handleError(error,res));
    }

    getCategories = async(req:Request,res:Response)=>{
        const [error,createCategorydto]= (req.body);  
        
    }


}