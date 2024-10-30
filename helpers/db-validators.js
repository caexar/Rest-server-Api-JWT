const { Categoria, Producto } = require("../models");
const Role = require("../models/role");
const Usuario=require("../models/usuario");

const esRolValido= async (rol=" ") => {
    const existeRol = await Role.findOne({rol});
    if (!existeRol) {
        throw new Error(` el rol ${rol} no esta registrado en la base de datos`)
    }
}


const emailExiste = async(correo)=>{
    const emailPrueba= await Usuario.findOne({correo});
    if (emailPrueba) {
        throw new Error(` el correo:  ${correo} ya esta registrado en la base de datos`)
    }
}

const existeUsuarioPorId = async(id)=>{
    const existeUsuario= await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(` el id:  ${id} no existe`);
    }
}
const existeCategoriaPorId = async(id)=>{
    const existeCategoria= await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(` el id:  ${id} no existe`);
    }
}
const existeProductoPorId = async(id)=>{
    const existeProducto= await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(` el producto con id:  ${id} no existe`);
    }
}
const coleccionesPermitidas=(coleccion="",colecciones=[])=>{
    const incluida=colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error("la coleccion no es permitida")
    }
    return true;
}

module.exports={esRolValido,coleccionesPermitidas,emailExiste,existeUsuarioPorId,existeCategoriaPorId,existeProductoPorId};