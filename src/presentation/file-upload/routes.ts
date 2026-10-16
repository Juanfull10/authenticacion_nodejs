import { Router } from 'express';
import {  fileUploadController } from './controller';
import { AuthMiddlewares } from '../middlewares/auth.middlewares';
import { fileUploadService } from '../servicio/file-upload.service';
import { FileUploadMiddleware } from '../middlewares/file-upload.middlewares';
import { TypeUploadMiddleware } from '../middlewares/type-middleware';






export class FileUploadRoutes {


  static get routes(): Router {

    const router = Router();
    const uploadService= new fileUploadService();
    const controller=new fileUploadController(uploadService);
    // Definir las rutas

    router.use(FileUploadMiddleware.containFiles);
   const checkType = TypeUploadMiddleware.checkType(['users','products','categories']);

    // api/upload/single<user|category|product>/
    // api/upload/multiple<user|category|product>/
    router.post('/single/:type', checkType,controller.uploadFile );

    router.post('/multiple/:type', checkType, controller.uploadMultipleFile);




    return router;
  }


}

