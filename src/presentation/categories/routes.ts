import { Router } from 'express';
import { CategoryController } from './controller';
import { categoryServices  } from '../servicio/category.service';
import { AuthMiddlewares } from '../middlewares/auth.middlewares';






export class CategoryRoutes {


  static get routes(): Router {

    const router = Router();
    const CategoryServices= new categoryServices();
    const controller=new CategoryController(CategoryServices);
    // Definir las rutas

    
    router.get('/', controller.getCategories );

     router.post('/', [AuthMiddlewares.jwtvalidate], controller.createCategory);




    return router;
  }


}

