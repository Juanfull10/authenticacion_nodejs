import { CategoryModel } from "../../data";
import { createCategoryDto, CustomError } from "../../domain";
import { CategoryEntity } from "../../domain/entities/category.entity";
import { UserEntity } from "../../domain/entities/user.entity";
import { PaginationDto } from "../shared/pagination.dto";

export class categoryServices {


    public async createCategory(CreateCategoryDto: createCategoryDto, user: UserEntity) {


        const existCategory = await CategoryModel.findOne({ name: CreateCategoryDto.name });
        if (existCategory) throw CustomError.badRequest('Category already exist');

        try {
            const category = new CategoryModel(
                {
                    ...CreateCategoryDto,
                    user: user.id
                }
            );


            await category.save();
            return {
                id: category.id,
                name: category.name,
                available: category.available,
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCategories(paginationDto: PaginationDto) {

        const total = await CategoryModel.countDocuments();
        const { page, limit } = paginationDto;
        const category = await CategoryModel.find()
            .skip((page - 1) * limit)
            .limit(limit);


        // const[total, category]= await Promise.all([
        //      CategoryModel.countDocuments(),
        //      CategoryModel.find()
        //        .skip((page - 1) * limit)
        //        .limit(limit)
        // ]);

        if (!category) throw CustomError.badRequest('Category already not exist');

        try {

            return {
                page: page,
                limit: limit,
                total: total,
                next:`/api/categories?page=${(page+1)}&limit${limit}`,
                prev:(page-1>0)?`/api/categories?page=${(page-1)}&limit${limit}`:null,
                categories: category.map(category => ({
                    id: category.id,
                    name: category.name,
                    available: category.available,
                })),
            }

        } catch (error) {

            throw CustomError.internalServer('Internal server error');
        }


    }


}