import { Router } from 'express';
import { AuthMiddlewares } from '../middlewares/auth.middlewares';
import {  productService } from '../servicio/product.service';
import { ProductController } from './controller';






export class ProductRoutes {


  static get routes(): Router {

    const router = Router();
    const ProductService= new productService();
    const controller=new ProductController(ProductService);
    // Definir las rutas

    
    router.get('/', controller.getProducts );

     router.post('/', [AuthMiddlewares.jwtvalidate], controller.createProduct);




    return router;
  }


}

