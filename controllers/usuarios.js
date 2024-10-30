const { response,request } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario=require("../models/usuario");


const usuariosGet = async (req=request,res= response)=>{
    const {limite = 5, desde =0}=req.query;
    const query = {estado:true};

    const [total,usuarios]= await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    res.json({total,usuarios});
}

const usuariosPut = async (req,res)=>{

    const {id}= req.params;
    const {_id,password,google,correo,...resto}=req.body;
    //validar contra base de datos
    if (password) {
        //encriptar
        const salt = bcryptjs.genSaltSync();
        resto.password=bcryptjs.hashSync(password,salt); 
    }
    //busco en los usuarios por (id) y actualizo la data (resto)
    const usuario= await Usuario.findByIdAndUpdate(id,resto);

    res.json({usuario});
}

const usuariosPost =  async (req,res)=>{

    const {nombre,correo,password,rol} = req.body;
    const usuario= new Usuario( {nombre,correo,password,rol});

    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password=bcryptjs.hashSync(password,salt);

    //guardar en base de datos
    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosDelete = async (req,res)=>{
    const {id}=req.params;
    const query = {estado:false};
    const usuarioAutenticado=req.usuario;
    
    //cambiar registro modo correcto sin eliminar
    const usuario = await Usuario.findByIdAndUpdate(id,query)
    res.json({usuario,usuarioAutenticado});
}

const usuariosPatch = (req,res)=>{
    res.json({
        msg: "Patch API - controlador"
    });
}

module.exports={
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}