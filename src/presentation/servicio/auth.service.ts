import { UserModer } from "../../data";
import { CustomError } from "../../domain";
import { registerUserDto } from "../../domain/dtos/auth/register-user.dts";
import { UserEntity } from "../../domain/entities/user.entity";
import { bcrypt, JwtAdapter } from "../../config";
import { loginUserdto } from "../../domain/dtos/auth/login-user.dts";

export class AuthService{


    constructor(){}


    public async registerUser(registerDto:registerUserDto){


        const existUser=await UserModer.findOne({email:registerDto.email});
        if(existUser)throw CustomError.badRequest('Email already exist');

         
        try {
            
            const user= new UserModer(registerDto);

            user.password=bcrypt.hash(registerDto.password);

            await user.save();

            const {password, ...rest}= UserEntity.fromObject(user);

            return {
                user:{...rest},
                token:'ABC',
            };

        } catch (error) {
            if(error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }


    }

    public async loginUser(loginUser:loginUserdto){

        const user= await UserModer.findOne({email:loginUser.email})
        if(!user) throw CustomError.badRequest('Email not exist');

        try {

            const {password, ...rest}=UserEntity.fromObject(user);      

            const isMatch= bcrypt.compare(loginUser.password,password);

            if(!isMatch) throw CustomError.badRequest('password not correct');

            const token= await JwtAdapter.generateToken({id: user.id});

            if(!token)throw CustomError.internalServer('Error  While creating JWT')

            return {
                user:{...rest},
                token:token,
            }

        } catch (error) {
            if(error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }

        



    }
}