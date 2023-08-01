import Todo from "@/models/Todo";
import dbConnect from "@/utils/dbConnect";

export default async (req,res) => {
    const {method} = req;
    const {id} = req.query;
    await dbConnect();

    if(method==="PUT"){
        try {
            const result = await Todo.findByIdAndUpdate(
                id,
                {$set:req.body},
                {new:true}
            );
            res
                .status(200)
                .json({data:result, message:"Todo updated Success"});
        } catch (error){
            res.status(500).json({message:"Internal Server Error; method: PUT"});
            console.log(error)
        }
    }
    if(method==="DELETE"){
        try {
            await Todo.findByIdAndDelete(id);
            res.status(200).json({message:"Task deleted Successfuly"});
        } catch(error){
            res.status(200).json({message:"Internal Server Error; method: DELETE"});
        }
    }
}