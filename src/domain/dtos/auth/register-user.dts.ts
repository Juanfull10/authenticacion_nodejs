import { regularExps } from "../../../config/regulat-exp"

export class registerUserDto{
    constructor(
        public name:string,
        public email:string,
        public password:string,
    ){}

    static create(object:{[key:string]:any}):[string?,registerUserDto?]{
        const {name,email,password}= object

        if(!name)return ['Missing name',undefined]

        if(!email)return ['Missing email',undefined]

        if(!regularExps.email.test(email))return['Email is not valid'];

        if(!password) return ["Missing password"];
        if(password.length<6) return ['Password too short'];

        return [undefined,new registerUserDto(name,email,password)];
    }



}