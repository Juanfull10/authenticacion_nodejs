import { envs } from "../../config";
import { CategoryModel } from "../mongo/models/category";
import { ProductModel } from "../mongo/models/product";
import { UserModer } from "../mongo/models/user.model";
import { MongoDataBase } from "../mongo/mongo-database";
import { seedData } from "./data";


(async()=>{


    await MongoDataBase.connect({
        dbName:envs.MONGO_DB_NAME,
        mongoUrl:envs.MONGO_URL,

    })

    await main();

    await MongoDataBase.disconect();
})();

const randomBetween0andX=(x:number)=>{

    return Math.floor(Math.random()*x);

}

async function main(){

    //0. Borrar todo!
    await Promise.all([
        UserModer.deleteMany(),
        CategoryModel.deleteMany(),
        ProductModel.deleteMany(),
    ]);

    //1. Crear usuarios

    const users= await UserModer.insertMany(seedData.users);

    //2. Crear categorias

    const categories= await CategoryModel.insertMany(
        seedData.categories.map(category=>{


            return {
                ...category,
                user:users[0]._id,
            }

        })
    )


    //3. Crear Productos

    const products= await ProductModel.insertMany(
        seedData.products.map(product=>{


            return {
                ...product,
                user:users[randomBetween0andX(seedData.users.length-1)]._id,
                category:categories[randomBetween0andX(seedData.users.length-1)]._id,
            }
        })
    )


}