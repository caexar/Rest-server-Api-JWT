const mongoose= require("mongoose");


const dbConnection = async ()=>{

    try {
        
        await mongoose.connect(process.env.mongodb_atlas,{
            useNewUrlParser: true,
            useUnifiedTopology:true,
            useCreateIndex:true,
            useFindAndModify:false
        });
        console.log("base de datos online")
     
    } catch (error) {
        console.log(error)
        throw new error("error a la hora de iniciar la db")
    }


}





module.exports={
    dbConnection
}