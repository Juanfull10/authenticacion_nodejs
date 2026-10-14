import { Request, Response } from "express";
import { registerUserDto } from "../../domain/dtos/auth/register-user.dts";
import { AuthService } from "../servicio/auth.service";
import { CustomError } from "../../domain";
import { loginUserdto } from "../../domain/dtos/auth/login-user.dts";


export class AuthController{

    constructor(
        public readonly authServices:AuthService,
    ){}

    private handleError=(error:unknown,res:Response)=>{
        if(error instanceof CustomError){
            return res.status(error.statusCode).json({error:error.message});
        }

        console.log(`${error}`)
        return res.status(500).json({error:'Internal server error'});
    }

  

    register=(req:Request, res:Response)=>{
        const [error,registerDto]= registerUserDto.create(req.body);

        if(error)return res.status(400).json({error})

        this.authServices.registerUser(registerDto!)
            .then((user)=>res.json(user))
            .catch(error=> this.handleError(error,res));

    }

    login=(req:Request, res:Response)=>{
        const [error,logindto]= loginUserdto.create(req.body);
        if(error)return res.status(400).json({error});

        this.authServices.loginUser(logindto!)
            .then((user)=>res.json(user))
            .catch(error=>this.handleError(error,res))
    }

    auth=(req:Request, res:Response)=>{

        const {token}= req.params;
        this.authServices.validateEmail(token)
            .then((user)=>res.json('EMAIL WAS VALIDATE '))
            .catch(error=>this.handleError(error,res))
     
    }


}