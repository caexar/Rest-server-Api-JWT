const {response}=require("express");
const fs =require("fs");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Producto, Usuario } = require("../models");
const path=require("path");
const cloudinary=require("cloudinary").v2
cloudinary.config(process.env.CLOUDINARY_URL);


const cargarArchivo= async (req,res=response)=>{
    
  
    if (!req.files || Object.keys(req.files).length === 0 ||!req.files.Archivo) {
      return res.status(400).json({
        msg:'No hay archivos subidos'
        });
    }


    try {
      const nombre=await  subirArchivo(req.files)
   res.json({nombre})
    } catch (msg) {
      res.status(400).json({
        msg
      })
    }
   
}

const actualiImagen=async(req,res=response)=>{
  const {id,coleccion}=req.params;

  let modelo;
  switch (coleccion) {
    case "usuarios":
        modelo= await Usuario.findById(id)
        if (!modelo) {
          return res.status(400).json({
            msg:"no existe este usuario"
          })
        }
      break;
      case "productos":
        modelo= await Producto.findById(id)
        if (!modelo) {
          return res.status(400).json({
            msg:"no existe le producto"
          })
        }
      break;

     default:
     return  res.status(500).json({
      msg:"se me olvido validar esto"
     })
  }

  //limpiar imagenes previas
  if (modelo.img) {
    //borrar la imagen del servidor
    //creo ell path
    const pathImg=path.join(__dirname,"../uploads",coleccion,modelo.img);
    //si existe el path con fs libreria de node
    if (fs.existsSync(pathImg)) {
      //borro el path con fs 
      fs.unlinkSync(pathImg);
    }
  }



  const subirImg=await subirArchivo(req.files,undefined,coleccion);
  modelo.img=await subirImg;
  await modelo.save();
  

  res.json(modelo);
}








const mostrarIMG = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: "No existe este usuario",
        });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: "No existe el producto",
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "Se me olvidó validar esto",
      });
  }

  // Limpiar imágenes previas
  if (modelo.img) {
    // Borrar la imagen del servidor
    const pathImg = path.join(__dirname, "../uploads", coleccion, modelo.img);
    if (fs.existsSync(pathImg)) {
      return res.sendFile(pathImg);
    }
  }

  // Imagen por defecto
  const defaultImagePath = path.join(__dirname, "../assets/no-Image.jpg");
  console.log(defaultImagePath)
  return res.sendFile(defaultImagePath);
  
};

const actualiImagenCloudinary=async(req,res=response)=>{
  const {id,coleccion}=req.params;

  let modelo;
  switch (coleccion) {
    case "usuarios":
        modelo= await Usuario.findById(id)
        if (!modelo) {
          return res.status(400).json({
            msg:"no existe este usuario"
          })
        }
      break;
      case "productos":
        modelo= await Producto.findById(id)
        if (!modelo) {
          return res.status(400).json({
            msg:"no existe le producto"
          })
        }
      break;

     default:
     return  res.status(500).json({
      msg:"se me olvido validar esto"
     })
  }

  //limpiar imagenes previas
  if (modelo.img) {
    const nombreArr=modelo.img.split("/");
    const nombre=nombreArr[nombreArr.length-1];
    const [public_id]=nombre.split(".");
    cloudinary.uploader.destroy(public_id);

  }
  //saco el path temporal de mi archivo
  const {tempFilePath}=req.files.Archivo
  //solamente saco el secure url de mi imagen(esto da mas info)
  const {secure_url}=await cloudinary.uploader.upload(tempFilePath);
  //grabo la secure url en mi modelo user o produ
  modelo.img=secure_url;
  //grabo
  await modelo.save();

  res.json(modelo);
}



module.exports={cargarArchivo,actualiImagen,actualiImagenCloudinary,mostrarIMG}