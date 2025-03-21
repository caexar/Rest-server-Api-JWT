

const esAdminRole=(req,res=response, next)=>{

    if (!req.usuario) {
        return res.status(500).json({
            msg: "se quiere verificar el rol sin validar le token"
        })
    }
    const {rol,nombre} = req.usuario;
    if (rol!=="ADMIN_ROLE") {
        return res.status(500).json({
            msg: `el ${nombre} no es administrador - no puede hacer esto`
        })
    }

    next();
}


const tieneRole=(...roles)=>{
   
    return (req,res=response, next) =>{
        if (!req.usuario) {
            return res.status(500).json({
                msg: "se quiere verificar el rol sin validar le token"
            })
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `el servicio requiere uno de estos roles ${roles}`
            })
        }


        next();
    }
}


module.exports={esAdminRole,tieneRole}