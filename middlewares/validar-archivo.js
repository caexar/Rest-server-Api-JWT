const { response } = require("express");

const validarArchivo =( req,res=response,next)=>{

    if (!req.files || Object.keys(req.files).length === 0 ||!req.files.Archivo) {
        return res.status(400).json({
             msg:'No hay archivos subidos-validarArchivos'
          });
      }
    next();
}

module.exports={
    validarArchivo
}