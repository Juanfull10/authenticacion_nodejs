import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService } from '../servicio/auth.service';




export class Authroutes {


  static get routes(): Router {

    const router = Router();
    const authServices= new AuthService();
      const controller = new AuthController(authServices);

    // Definir las rutas
    router.post('/login', controller.login );

    router.post('/register', controller.register );

    router.get('/validate-email/:token', controller.auth );



    return router;
  }


}


