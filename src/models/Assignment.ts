import mongoose, { Schema, Document, Model } from "mongoose";

interface IAssignment extends Document {
    fileURL?: string;
    content?: string;
    batch: mongoose.Types.ObjectId;
    submissionDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const assignmentSchema = new Schema<IAssignment>({
    fileURL: {
        type: String,
        default:null,
    },
    content: {
        type: String,
        default:null,
    },
    batch: {
        type: Schema.Types.ObjectId,
        ref: "batches",
        required: true,
    },
    submissionDate: {
        type: Date,
        required: true,
    }
}, { timestamps: true });

const Assignment: Model<IAssignment> = mongoose.models.assignments || mongoose.model<IAssignment>("assignments", assignmentSchema);

export default Assignment;
