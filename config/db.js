const mongoose = require('mongoose')

const connectDB = async () => {
    await mongoose.connect(process.env.URL, {
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser: true
    })
    if(process.env.NODE_ENV !== 'production'){
        console.log("Mongo DB connected")
    }else{
        console.log('Not Connected')
    }
    
}

module.exports = connectDB