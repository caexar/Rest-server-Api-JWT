const {response}=require("express");
const { Producto, Categoria } = require("../models");

//obtener productos publico
const obtenerProductos=async(req,res=response)=>{
    //del req agarro el limite y coloco desde por default
    const {limite=5,desde=0}=req.query;
    //ejecuto a la ve las dos promesas 
    const [total,productos]=await Promise.all([
        //total
        Producto.countDocuments({disponible:true}),
        //productos
        Producto.find({disponible:true})
                .populate("usuario","nombre")
                .skip(Number(desde))
                .limit(Number(limite))
    ]);
    //respuesta
    res.json({total,productos});
}
//obtener productos por id
const obtenerProductosId=async(req,res=response)=>{
        //extraemos la id de los parametros
        const {id}= req.params;
        //buscamos el producto por su id
        const buscarProducto= await Producto.findById(id)
                                    .populate("usuario","nombre");
        res.json(buscarProducto)
}



const crearProducto= async (req,res=response)=>{
    //extraigo el nombre del body
    const { nombre, categoria:nombreCategoria, descripcion, precio } = req.body;
    

   const productoDB = await Producto.findOne({ nombre });

   if (productoDB  ) {
       return res.status(400).json({
           msg: `El producto ${productoDB.nombre} ya existe`
       });
   }
   const nombreCategoriaU=req.body.categoria.toUpperCase();
  
   // Buscar si la categoría existe
   const categoriaDB = await Categoria.findOne({ nombre: nombreCategoriaU });

   if (!categoriaDB) {
       return res.status(400).json({
           msg: `La categoría ${nombreCategoria} no existe`
       });
   }
    //generar la data a guardar
    const data={
        nombre,
        categoria:categoriaDB._id,
        descripcion,
        precio,
        usuario:req.usuario._id
    }
    //crear la categoria 
    const producto= new Producto(data);  
    
    //guardar DB
    await producto.save();

    res.status(201).json(producto)
}
const actualizarProducto = async (req, res = response) => {
    // Extraemos la id de los parámetros
    const { id } = req.params;
    const { estado, usuario, categoria: nombreCategoria, ...data } = req.body;
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            msg: "No hay nada para actualizar"
        });
    }
    if (nombreCategoria) {
        const categoriaDB = await Categoria.findOne({ nombre: nombreCategoria.toUpperCase() });

        if (!categoriaDB) {
            return res.status(400).json({
                msg: "La categoría que estás cambiando no existe"
            });
        }

        data.categoria = categoriaDB._id;
    }

    data.usuario = req.usuario._id;
    
    // Busco en las categorías por (id) y actualizo la data (data)
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json(producto);
}

const borrarProducto=async(req,res=response)=>{
    //extraemos la id de los parametros
    const {id}= req.params;
    //verificamos si el producto ha sido borrado
    const verificarBorrado=await Producto.findById(id)
    if (verificarBorrado.estado === false && verificarBorrado.disponible === false) {
        return res.json({
            msg:"el producto ya fue borrado"
        })
    }
    //usamos producto y actualiamos los estados a false
    const ProductoBorrado=await Producto.findByIdAndUpdate(id,{estado:false,disponible:false},{new:true});
    //respuesta
    res.status(200).json(ProductoBorrado)
}

module.exports={
    crearProducto,
    obtenerProductos,
    obtenerProductosId,
    borrarProducto,
    actualizarProducto
}