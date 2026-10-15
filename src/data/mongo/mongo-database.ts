import mongoose from 'mongoose';

interface ConnectionOptions{
    mongoUrl:string;
    dbName:string ;
}

export class MongoDataBase{
    static async connect(options:ConnectionOptions){
        const {mongoUrl,dbName}=options


        try {

            await mongoose.connect(mongoUrl,{
                dbName:dbName,
                
            });

            console.log("Mongo conectado")
            return true;
            
        } catch (error) {
            console.log("Mongo connection error");

            throw error;
        }
    }

    static async disconect(){
        await mongoose.disconnect();
    }
}