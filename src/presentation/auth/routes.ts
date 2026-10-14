import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService } from '../servicio/auth.service';
import { EmailService } from '../servicio/email.service';
import { envs } from '../../config';




export class Authroutes {


  static get routes(): Router {

    const router = Router();
    const emailService=new EmailService(
    
      envs.MAILER_SECRET_KEY,
      envs.MAILER_EMAIL,
      envs.MAILER_SERVICE,
      envs.SEND_EMAIL,
    );
    const authServices= new AuthService(emailService);
      const controller = new AuthController(authServices);

    // Definir las rutas
    router.post('/login', controller.login );

    router.post('/register', controller.register );

    router.get('/validate-email/:token', controller.auth );



    return router;
  }


}


