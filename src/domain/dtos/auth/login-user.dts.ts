import { regularExps } from "../../../config/regulat-exp"

export class loginUserdto{
    constructor(
        public email:string,
        public password:string,
    ){}

    static create(object:{[key:string]:any}):[string?,loginUserdto?]{
        const {email,password}= object


        if(!email)return ['Missing email',undefined]

        if(!regularExps.email.test(email))return['Email is not valid'];

        if(!password) return ["Missing password"];
        if(password.length<6) return ['Password too short'];

        return [undefined,new loginUserdto(email,password)];
    }



}