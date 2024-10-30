const {v4:uuidv4}=require("uuid");
const path =require("path");

const subirArchivo=(files,extensionesValidas=["png","jpg","jpeg","gif"],carpeta="")=>{
    return new Promise((resolve,reject)=>{
    // desestructurar el archivo
     const {Archivo}= files;
     const nombreCortado= Archivo.name.split(".");
     const extension=nombreCortado[nombreCortado.length-1]
 
     // validar la extension
     if (!extensionesValidas.includes(extension)) {
        return reject("extension no permitida")
     }
     
 
     //concatenamos el nuevo nombre
     const nombreTemp=uuidv4()+"."+extension;
     //colocamos el path donde colocaremos el archivo y le pasamos el nuevo nombre
     const uploadPath = path.join(__dirname, '../uploads/',carpeta, nombreTemp);
   
     Archivo.mv(uploadPath, (err)=> {
       if (err){
            reject(err)
       }
       resolve(nombreTemp);
     });
    })
    


}

module.exports={subirArchivo}