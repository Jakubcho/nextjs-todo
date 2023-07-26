import mongoose from "mongoose";

const DB_URL = "mongodb+srv://jakubchola92:XVbV3cVZI6xhPLqz@todoclaster.lqmxdsd.mongodb.net/TodoList?retryWrites=true&w=majority"

if(!DB_URL){
    throw new Error(
        "Add DB_URL in environment"
    )
}

let cached = global.mongoose;
if(!cached){
    cached=global.mongoose = { conn: null, promise: null};
}

const dbConnect = async () => {
    if(cached.conn){
        return cached.conn;
    }
    if(!cached.conn){
        const options = {
            useNewUrlParser:true,
            useUnifiedTopology:true,
        };
        cached.promise = mongoose.connect(DB_URL,options).then((mongoose) => {
            return mongoose
        })
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
export default dbConnect;