const{response}=require("express");
const { ObjectId } = require("mongoose").Types;
const {Usuario,Categoria,Producto,Role}=require("../models")

const coleccionesPermitidas=[
    "usuarios",
    "categoria",
    "productos",
    "roles",
    "buscarProductosXcategoria"
];

const buscarUsuario=async(termino="",res=response)=>{

    const esMongoID= ObjectId.isValid(termino);//true o false

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        if (usuario) {
            return res.json({  
                //si existe el usuario envia el arreglo con el usuario 
                results: [usuario] })
        }else{
            return res.json({  
            // si no entonces envia arreglo vacio
            results: [] })
        }

    } 
    //buscar por nombre o correo insensiblemente con expresion regular
    const regex=new RegExp(termino,"i"); // esto hace que busque por cualquier letra
    const usuarios=await Usuario.find({
        $or:[{nombre:regex},{correo:regex}],// busqueda con condiciones ya sea por nombre OR correo
        $and:[{estado:true}]// y tambien debe tener esta condicion
    });
  
    res.json({
        results:usuarios
    })


}
const buscarCategoria=async(termino="",res=response)=>{

    const esMongoID= ObjectId.isValid(termino);//true o false

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        if (categoria) {
            return res.json({  
                //si existe la categoria envia el arreglo con el usuario 
                results: [categoria] })
        }else{
            return res.json({  
            // si no entonces envia arreglo vacio
            results: [] })
        }

    } 
    //buscar por nombre insensiblemente con expresion regular
    const regex=new RegExp(termino,"i"); // esto hace que busque por cualquier letra
    const categoria=await Categoria.find({
        // busqueda con condiciones por nombre
        $and:[{nombre:regex},{estado:true}]// y tambien debe tener esta condicion
    });
  
    res.json({
        results: categoria
    })


}
const buscarProductos=async(termino="",res=response)=>{

    const esMongoID= ObjectId.isValid(termino);//true o false

    if (esMongoID) {
        const productos = await Producto.findById(termino)
                         .populate("categoria","nombre");
        if (productos) {
            return res.json({  
                //si existe la categoria envia el arreglo con el usuario 
                results: [productos] })
        }else{
            return res.json({  
            // si no entonces envia arreglo vacio
            results: [] })
        }

    } 
    //buscar por nombre insensiblemente con expresion regular
    const regex=new RegExp(termino,"i"); // esto hace que busque por cualquier letra
    const productos=await Producto.find({
        // busqueda con condiciones por nombre
        $and:[{nombre:regex},{estado:true},{disponible:true}]// y tambien debe tener esta condicion
    })
    .populate("categoria","nombre");
  
    res.json({
        results: productos
    })


}
const buscarProductosXcategoria=async(termino="",res=response)=>{

    const esMongoID= ObjectId.isValid(termino);//true o false

    if (esMongoID) {
        const productos = await Producto.find({categoria:termino})
                         .populate("categoria","nombre");
                         
        if (productos) {
            return res.json({  
                //si existe la categoria envia el arreglo con el usuario 
                results: [productos] })
        }else{
            return res.json({  
            // si no entonces envia arreglo vacio
            results: [] })
        }

    } 

}



const buscar=(req,res=response) =>{

    const {coleccion,termino}=req.params;


    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg:`las coleeciones permitidas son ${coleccionesPermitidas}`
        })
    }
    switch (coleccion) {
        case "usuarios":
            buscarUsuario(termino,res);
        break;

        case"categoria":
            buscarCategoria(termino,res);
        break;
            
        case "productos":
            buscarProductos(termino,res);

        break;
        case "buscarProductosXcategoria":
            buscarProductosXcategoria(termino,res);

        break;

        default:
            res.status(500).json({
                msg:"se me olvido hacer esta busqueda"
            })
    }
}

module.exports={buscar}