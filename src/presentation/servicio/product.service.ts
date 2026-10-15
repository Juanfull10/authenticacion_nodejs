

import { CategoryModel, ProductModel } from "../../data";
import {  CustomError } from "../../domain";
import { createProductDto } from "../../domain/dtos/product/create-product";
import { PaginationDto } from "../shared/pagination.dto";
 

export class productService {


    public async createProduct(createProductDto: createProductDto) {


        const createProducts = await ProductModel.findOne({ name: createProductDto.name });
        if (createProducts) throw CustomError.badRequest('Product already exist');

        try {
            const product = new ProductModel(createProductDto);


            await product.save();
            return product;

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCategories(paginationDto: PaginationDto) {

        const total = await ProductModel.countDocuments();
        const { page, limit } = paginationDto;
        const products = await ProductModel.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('user')
            .populate('category')


        // const[total, category]= await Promise.all([
        //      CategoryModel.countDocuments(),
        //      CategoryModel.find()
        //        .skip((page - 1) * limit)
        //        .limit(limit)
        // ]);

        if (!products) throw CustomError.badRequest('products already not exist');

        try {

            return {
                page: page,
                limit: limit,
                total: total,
                next:`/api/categories?page=${(page+1)}&limit${limit}`,
                prev:(page-1>0)?`/api/categories?page=${(page-1)}&limit${limit}`:null,
                products: products,
            }

        } catch (error) {

            throw CustomError.internalServer('Internal server error');
        }


    }


}    