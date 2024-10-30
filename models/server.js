const express=require("express")
const cors=require("cors")
const {dbConnection} = require("../database/config");
const fileUpload = require("express-fileupload");
class Server {
    constructor(){
        this.app= express();
        this.port= process.env.PORT;



        this.paths={
            auth:"/api/auth",
            usuarios:"/api/usuarios",
            categorias:"/api/categorias",
            productos:"/api/productos",
            buscar:"/api/buscar",
            uploads:"/api/uploads"
        }
       

        //conectar a db
        this.conectarDB();
        //middlewares
        this.middlewares();
        //ruta de mi aplicacion
        this.routes();
    }
    
    async conectarDB(){
        await dbConnection();
    }
    //esto se ejecuta antes de mandar a la ruta
    middlewares(){
        //CORS 
        this.app.use(cors());
        //lectura y parseo body
        this.app.use(express.json());

        //directorio publico
        this.app.use( express.static("public") );
        //file uploads
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath:true
        }));
    }
    routes(){
       this.app.use(this.paths.auth, require("../routes/auth"));
       this.app.use(this.paths.categorias, require("../routes/categorias"));
       this.app.use(this.paths.usuarios, require("../routes/usuarios"));
       this.app.use(this.paths.productos, require("../routes/productos"));
       this.app.use(this.paths.buscar, require("../routes/buscar"));
       this.app.use(this.paths.uploads, require("../routes/uploads"));
    }
    listen(){
        this.app.listen(this.port, () =>{
            console.log("Servidor corriendo en puerto",process.env.PORT)
        })
    }
}

module.exports= Server;