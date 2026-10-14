import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModer } from "../../data";
import { UserEntity } from "../../domain/entities/user.entity";

export class AuthMiddlewares{


    constructor(){}

    static async jwtvalidate(req:Request,res:Response,next:NextFunction){

        const autorization=req.header('Authorization');
        if(!autorization) return res.status(401).json({error:'No token provider'});

        if(!autorization.startsWith('Bearer ')) return res.status(401).json({error:'invalid bearer token'});

        const token= autorization.split(' ').at(1)||'';

        try {
            
            const payload=await JwtAdapter.validateToken<{id:string}>(token);
            if(!payload) return  res.status(401).json({error:'Invalid token'});

            const user = await UserModer.findById(payload.id);
            if(!user) return res.status(401).json({error:'invalid token'});
            



            req.body.user=UserEntity.fromObject(user);

            next();


        } catch (error) {
            
            console.log(error);
            res.status(500).json({error:'internal server error'})

        }


    }
}