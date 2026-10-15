import { Router } from 'express';
import {  fileUploadController } from './controller';
import { AuthMiddlewares } from '../middlewares/auth.middlewares';
import { fileUploadService } from '../servicio/file-upload.service';






export class FileUploadRoutes {


  static get routes(): Router {

    const router = Router();
    const uploadService= new fileUploadService();
    const controller=new fileUploadController(uploadService);
    // Definir las rutas

    // api/upload/single<user|category|product>/
    // api/upload/multiple<user|category|product>/
    router.post('/single/:type', controller.uploadFile );

     router.post('/multiple/:type', controller.uploadMultipleFile);




    return router;
  }


}

