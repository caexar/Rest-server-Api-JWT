const { response, request } = require("express");
require ("dotenv").config({path:"./.env"});
const Usuario=require("../models/usuario");
const jwt=require("jsonwebtoken");



const validarJWT=async (req=request,res = response,next)=>{

    const token = req.header("x-token");
    if (!token) {
        return res.status(401).json({
            msg:"no hay token en la peticion"
        });
    }

    try {

        const {uid}=jwt.verify(token,process.env.SECRETPRIVATEKEY);
        //leer el usuario que corresponde al uid
        const usuario= await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg:"token no valido- usuario no existe en db"
            }) 
        }

        // verificar el estado del usuario
        if (!usuario.estado) {
            return res.status(401).json({
                msg:"token no valido- usuario con estado: false"
            })
        }

        req.usuario=usuario;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: "el token no es valido"
        });
    }


    console.log(token);
   
}

module.exports={
    validarJWT
}


