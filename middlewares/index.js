

const validarCampos= require("../middlewares/validar-campos");
const validarJWT = require("../middlewares/validar-jwt");
const ValidarRoles = require("../middlewares/validar-roles");
const ValidarArchivos=require("./validar-archivo")
module.exports={
    ...validarCampos,
    ...validarJWT,
    ...ValidarRoles,
    ...ValidarArchivos
}