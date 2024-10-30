const {response}=require("express");
const {Categoria}=require("../models");

//obtener categorias-paginado-total-populate
const obtenerCategorias=async(req,res=response)=>{
    //del req agarro el limite  y coloco desde por default
    const {limite = 5, desde =0}=req.query;
    //ejecuto a la vez dos promesas [total,categorias]
    const [total,categorias]= await Promise.all([
        //total
        Categoria.countDocuments({estado:true}),
        //categorias
        Categoria.find({estado:true})
            .populate("usuario","nombre")
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    //imprimo la respuesta
    res.json({total,categorias});
}

//obtener categoria id - pupolate {}
    const obtenerCategoriasId= async(req,res=response)=>{
         const {id}= req.params;
        const buscarCategoria= await Categoria.findById(id)
                                    .populate("usuario","nombre");
        res.json(buscarCategoria)
    }
    



const crearCategoria= async (req,res=response)=>{
    //extraigo el nombre del body
    const nombre =req.body.nombre.toUpperCase();
    //uso el nombre para buscar en categoria 
    const categoriaDB = await Categoria.findOne({nombre});
    // si tiene documento entonces ya existe
    if (categoriaDB) {
        return res.status(400).json({
            msg: `la categoria ${categoriaDB.nombre}, ya existe`
        });
    }
    //generar la data a guardar
    const data={
        nombre,
        usuario:req.usuario._id
    }
    //crear la categoria 
    const categoria= new Categoria(data);  
    
    //guardar DB
    await categoria.save();

    res.status(201).json(categoria)


}

//actualizar categoria
const actualizarCategorias=async (req,res=response)=>{
    const {id}= req.params;
    const {estado,usuario,...data}=req.body;
    data.nombre=data.nombre.toUpperCase();
    data.usuario=req.usuario._id;

    //busco en los categorias por (id) y actualizo la data (data)
    const categoria= await Categoria.findByIdAndUpdate(id,data,{new: true});

    res.json(categoria);
}


//borrar categoria estado  false
const borrarCategoria=async (req,res=response)=>{

    const {id}= req.params;
    const categoriaBorrada=await Categoria.findByIdAndUpdate(id,{estado:false},{new:true});
    res.status(200).json(categoriaBorrada)

}


module.exports={
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriasId,
    actualizarCategorias,
    borrarCategoria
}