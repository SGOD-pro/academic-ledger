
import mongoose, { Schema, Document } from "mongoose";
import Attendence from "./Attendence";
import Student from "./StudentModel";
export interface IBatch extends Document {
    subject: string;
    endTime: string;
    startTime: string;
    days: string[];
}
const batchSchema = new Schema<IBatch>({
    subject: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: [true, "Please enter time."]
    },
    startTime: {
        type: String,
        required: [true, "Please enter time."]
    },
    days: {
        type: [String],
        default: [],
        required: true
    }
});

batchSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const deletedBatch = this as IBatch; // Type assertion to IBatch
    try {
        await Attendence.deleteMany({ batchId: deletedBatch._id });
        console.log("Related attendances deleted");

        await Student.updateMany(
            { batches: deletedBatch._id },
            { $pull: { batches: deletedBatch._id, presentByBatch: { batchId: deletedBatch._id } } }
        );
        console.log("Student records updated");

        next();
    } catch (error:any) {
        console.error("Error in pre-deleteOne middleware:", error);
        next(error); 
    }
});

const Batches: mongoose.Model<IBatch> = mongoose.models.batches || mongoose.model<IBatch>("batches", batchSchema);

export default Batches;
