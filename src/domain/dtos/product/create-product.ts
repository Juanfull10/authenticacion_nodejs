import { Validator } from "../../../data/mongo/models/validator";


export class createProductDto{

    private constructor(
        public readonly name:string,
        public readonly isavailable:boolean,
        public readonly price:number,
        public readonly description:string,
        public readonly user:string,
        public readonly category:string,
   
    ){}


    static create(object:{[key:string]:any}):[string?,createProductDto?]{
        const {
            name,
            isavailable,
            price,
            description,
            user,
            category
        }= object;

        if(!name) return ['Missing name'];
        if(!user) return ['Missing user'];
        if(!Validator.isMongoId(user)) return ['invalid user ID'];
        if(!category) return ['Missing category'];
        if(!Validator.isMongoId(category)) return ['invalid user ID'];

    
        return [undefined,new createProductDto(
            name,
            !!isavailable,
            price,
            description,
            user,
            category
        )];

    }

}