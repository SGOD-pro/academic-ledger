import mongoose,{Schema} from "mongoose";
const subjectSchema = Schema({
    subject: {
        type:String,
        unique:true,
        required:true
    },
})

const Subject=mongoose.models.subjects||mongoose.model("subjects",subjectSchema);
export default Subject