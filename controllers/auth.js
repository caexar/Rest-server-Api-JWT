const {response}=require("express");
const Usuario=require("../models/usuario");
const bcryptjs= require("bcryptjs");
const { generarJWT } = require("../helpers/generarJWT");
const { GoogleVerify } = require("../helpers/google.verify");

const login=async(req,res = response)=>{

    const {correo,password}=req.body;
    try {
        
        //verificar si es email existe
        const usuario = await Usuario.findOne({correo});
        if (!usuario) {
            return res.status(400).json({
                msg:"el usuario/ password no son correctos - correo"
            })
        }
        //verificar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg:"el usuario/ password no son correctos - estado: false"
            })
        }

        //verificar la contraseña
        const validPassword = bcryptjs.compareSync(password,usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                msg:"el usuario/ password no son correctos - password"
            })
        }

        //generar jwt
        
        const token = await generarJWT(usuario.id);

        res.json({
           usuario,
           token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "hablo con el administrador"
        })
    }
}


const googleSingIn=async(req,res=response)=>{

    const {id_token}=req.body;
    try {
        const {correo,nombre,img}= await GoogleVerify(id_token);
        let usuario = await Usuario.findOne({correo});
        //si no hay usuario con el correo
        if (!usuario) {
            //tengo quie crearlo
            const data={
                nombre,
                correo,
                rol: "ADMIN_ROLE",
                password:":p",
                img,
                google:true
            };
            usuario= new Usuario(data);
            await usuario.save();
        }
        //si el usuario en db fue eliminado
        if (!usuario.estado) {
            return res.status(401).json({
                msg: "hable con el administrador, usuario bloqueado"
            });      
        }

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
    } catch (error) {
        res.status(400).json({
            msg: "el token no se pudo verificar---"
        })
    }


    
    

}


module.exports={
    login,googleSingIn
}