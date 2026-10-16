import { Router } from "express";
import { ImageController } from "./controllers";


export class ImageRoute{
    static get routes():Router{
        const router= Router();
        const imageController= new ImageController();

        router.get('/:type/:img',imageController.getImage);


        return router;
    }
}