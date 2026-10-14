import { CategoryModel } from "../../data";
import { createCategoryDto, CustomError } from "../../domain";
import { CategoryEntity } from "../../domain/entities/category.entity";
import { UserEntity } from "../../domain/entities/user.entity";

export class categoryServices{


     public async createCategory(CreateCategoryDto:createCategoryDto,user:UserEntity){
    
    
            const existCategory=await CategoryModel.findOne({name:CreateCategoryDto.name});
            if(existCategory)throw CustomError.badRequest('Category already exist');

            try {
                const category= new CategoryModel(
                  {
                    ...CreateCategoryDto,
                    user:user.id
                  }
                );


                await category.save();
                return{
                    id:category.id,
                    name:category.name,
                    available:category.available,
                }

            } catch (error) {
                        throw CustomError.internalServer(`${error}`);
            }
        }

        async getCategories(CreateCategoryDto:createCategoryDto,user:UserEntity){

          const category=await CategoryModel.find();
            if(!category)throw CustomError.badRequest('Category already not exist');

          try { 
            
            return category.map(category=>({
                id: category.id,
                name: category.name,
                available: category.available,
            }));
            
          } catch (error) {
            
                 throw CustomError.internalServer('Internal server error');
          }
        

        }


}