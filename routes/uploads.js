const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const { cargarArchivo, actualiImagen, mostrarIMG, actualiImagenCloudinary } = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers/db-validators");
const { validarArchivo } = require("../middlewares");
const router = Router();


router.post("/",validarArchivo,cargarArchivo)

router.put("/:coleccion/:id",[
    check("id","el id debe ser de mongo").isMongoId(),
    validarArchivo,
    check("coleccion").custom(c=>coleccionesPermitidas(c,["usuarios","productos"])),
    validarCampos
],actualiImagenCloudinary)

router.get("/:coleccion/:id",[
    check("id","el id debe ser de mongo").isMongoId(),
    check("coleccion").custom(c=>coleccionesPermitidas(c,["usuarios","productos"])),
    validarCampos
],mostrarIMG)

module.exports = router;
