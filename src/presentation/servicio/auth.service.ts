import { UserModer } from "../../data";
import { CustomError } from "../../domain";
import { registerUserDto } from "../../domain/dtos/auth/register-user.dts";
import { UserEntity } from "../../domain/entities/user.entity";
import { bcrypt, envs, JwtAdapter } from "../../config";
import { loginUserdto } from "../../domain/dtos/auth/login-user.dts";
import { EmailService } from "./email.service";

export class AuthService{


    constructor(
        private readonly emailService:EmailService,
    ){}


    public async registerUser(registerDto:registerUserDto){


        const existUser=await UserModer.findOne({email:registerDto.email});
        if(existUser)throw CustomError.badRequest('Email already exist');

         
        try {
            
            const user= new UserModer(registerDto);

            user.password=bcrypt.hash(registerDto.password);

            await user.save();

            await this.sendEmailValidationLink(user.email);
            const {password, ...rest}= UserEntity.fromObject(user);
            const token= await JwtAdapter.generateToken({id: user.id});

            if(!token)throw CustomError.internalServer('Error  While creating JWT')
            
            return {
                user:{...rest},
                token:token,
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

    private sendEmailValidationLink= async(email:string)=>{

        const token= await JwtAdapter.generateToken({email});
        if(!token)throw CustomError.internalServer('Error getting token');

        const link=`${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const html=`
            <h1>Validate your email</h1>
            <p>Click on the following link to validate your email</p>
            <a href="${link}">Validate your email: ${email}</a>
        `

        const options={
            to:email,
            subject:'validate your email',
            htmlBody:html,
        }

        const isSet=await this.emailService.sendEmail(options);

        if(!isSet)throw CustomError.internalServer('Error sending email');

        return true;

    }

    public validateEmail= async(token:string)=>{

        const payload=await JwtAdapter.validateToken(token);
        if(!payload)throw CustomError.unaAuthozed('token not valid');

        const {email}= payload as {email:string};
        if(!email) throw CustomError.internalServer('Email not in token');


        const user= await UserModer.findOne({email});
        if(!user) throw CustomError.internalServer('user not in token');

        user.emailValidate=true;
        await user.save();
        return true;
    }   
} 