const { Router } = require("express");
const { check } = require("express-validator");

const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");
const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoriasId, 
        actualizarCategorias, 
        borrarCategoria} = require("../controllers/categorias");
const { existeCategoriaPorId } = require("../helpers/db-validators");

const router = Router();

//obtener categorias publico
router.get("/",obtenerCategorias)

//obtener una categoria por id publico
router.get("/:id",[
    check("id","no es un id valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos
],obtenerCategoriasId)

//crear categoria- privado- cualquier persona con un token valido
router.post("/",[
    validarJWT,
    check("nombre","el nombre el obligatorio").not().isEmpty(),
    validarCampos
],crearCategoria)



//actualizar - privado- cualquiera con token valido
router.put("/:id",[
    validarJWT,
    check("id").custom(existeCategoriaPorId),
    check("nombre","el nombre el obligatorio").not().isEmpty(),
    validarCampos
],actualizarCategorias)


//borrar una categoria-admin
router.delete("/:id",[
    validarJWT,
    esAdminRole,
    check("id","no es un id valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos
],borrarCategoria)

module.exports = router;
