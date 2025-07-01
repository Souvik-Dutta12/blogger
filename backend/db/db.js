import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`\n Mongodb connected !! DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error(error);
        console.log("Mongodb Connection failed !! , Attempting to reconnect");
    }
}


export default connectDB


