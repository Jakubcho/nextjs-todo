import Todo from "@/models/Todo";
import dbConnect from "@/utils/dbConnect";

export default async (req,res) => {
    const {method} = req;

    await dbConnect();

    if(method==="POST"){
        try {
            const newTodo = await new Todo(req.body).save();
            res
                .status(200)
                .json({data:newTodo, message:"Todo added success"});
        } catch(error){
            res.status(500).json({message:"Internal Server Error; method: POST"});
            console.log(error);
        }
    }
    if(method==="GET"){
        try {
            const todos = await Todo.find();
            res.status(200).json({data:todos});
        } catch(error){
            res.status(500).json({message:"Internal Server Error; method: GET"});
            console.log(error);
        }
    }
}