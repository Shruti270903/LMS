import mongoose from "mongoose";

//Connect to the MONGODB database

const connectDB = async ()=>{
    mongoose.connection.on('connected', ()=> console.log('Database Connected'))

    await mongoose.connect(`${process.env.MONGODB_URI}/LMS`)
}
export default connectDB