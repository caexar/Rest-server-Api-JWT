const {Router} = require("express");
const { usuariosGet,
        usuariosPut,
        usuariosPost,
        usuariosDelete,
        usuariosPatch } = require("../controllers/usuarios");

const {validarCampos,
       validarJWT,
       esAdminRole,
       tieneRole} =require("../middlewares");

const { check } = require("express-validator");
const { emailExiste, existeUsuarioPorId } = require("../helpers/db-validators");
const Role = require("../models/role");
const { esRolValido } = require("../helpers/db-validators");
const router = Router();



router.get("/", usuariosGet );
router.put("/:id",[
    check("id","no es un id valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRolValido),
    validarCampos
], usuariosPut );
router.post("/",[
    check("nombre", "el nombre es obligatorio").not().isEmpty(),
    check("password", "el password debe ser mas de 6 letras").isLength({min:6}),
    check("correo", "el correo no es valido").isEmail().custom(emailExiste),
    //check("rol", "no es un rol permitido").isIn(["ADMIN_ROLE","USER_ROLE"]),
    check("rol").custom(esRolValido),
    validarCampos
] ,usuariosPost);
router.patch("/", usuariosPatch);

router.delete("/:id",[
    validarJWT,
    //esAdminRole,
    tieneRole("ADMIN_ROLE","VENTAS_ROLE"),
    check("id","no es un id valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos
] ,usuariosDelete);








module.exports=router;


