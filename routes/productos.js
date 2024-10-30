//rutas
const { Router } = require("express");
//validador
const { check } = require("express-validator");
//validadores personalizados
const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");
//configurar
const { existeCategoriaPorId, existeProductoPorId } = require("../helpers/db-validators");
const { crearProducto, obtenerProductos, obtenerProductosId, borrarProducto, actualizarProducto } = require("../controllers/productos");
//ejecuta router
const router = Router();



//obtener productos
router.get("/",obtenerProductos)

//obtener un producto por id
router.get("/:id",[
    check("id","no es un id valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos
],obtenerProductosId)


//crear categoria- privado- cualquier persona con un token valido
router.post("/",[
    validarJWT,
    check("nombre","el nombre el obligatorio").not().isEmpty(),
    check("estado","el estado el obligatorio").not().isEmpty(),
    check("categoria","la categoria el obligatoria").not().isEmpty(),
    //check("categoria").custom(existeCategoriaPorId),
    check("descripcion","el nombre el obligatorio").not().isEmpty(),
    validarCampos
],crearProducto)

//actualizar - privado- cualquiera con token valido
router.put("/:id",[
    validarJWT,
    check("id").custom(existeProductoPorId),
    validarCampos
],actualizarProducto)



router.delete("/:id",[
    validarJWT,
    esAdminRole,
    check("id","no es un id valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos
],borrarProducto)


module.exports=router;