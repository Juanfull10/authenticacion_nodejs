import { Request, Response } from "express";
import { createCategoryDto, CustomError } from "../../domain";
import { categoryServices } from "../servicio/category.service";
import { PaginationDto } from "../shared/pagination.dto";




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

        const {page=1,limit=5}=req.query;

        const [error,paginationDto]=PaginationDto.create(+page,+limit);

        if(error) return res.status(400).json({error});

        this.categoryServices.getCategories(paginationDto!)
            .then(category=>res.status(200).json(category))
            .catch(error=>this.handleError(error,res));
        
    
    
    }


}