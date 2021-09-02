const mongoose = require('mongoose');


const connect = mongoose.connect("mongodb://localhost:27017/basicAuth",{
    useNewUrlParser : true,
    useUnifiedTopology: true,
    // useCreateIndex: true
})

exports.startDatabase = async()=>{
    try{
        const db = await connect
        console.log("Mongo connection open!")
        // console.log(db)
    }catch(err){
        console.log("Mongo connection Failed")
        console.log(err)
    }
}
