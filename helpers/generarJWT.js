const jwt = require("jsonwebtoken");


const generarJWT = (uid="") =>{
    return new Promise ((resolve,reject)=> {

    const playload={uid};
    jwt.sign(playload,process.env.SECRETPRIVATEKEY,{
        expiresIn:"4h"
    },(err,token)=>{
        if (err) {
            console.log(err);
            reject("no se pudo generar el token")
        }else{
            resolve(token)
        }
    })
    }) 
}




module.exports={generarJWT};