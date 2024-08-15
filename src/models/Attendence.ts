import mongoose, { Schema, Document, Model } from "mongoose";

interface IAttendence extends Document {
    batchId: mongoose.Types.ObjectId;
    studentsId: mongoose.Types.ObjectId[];
}

const attendenceSchema = new Schema<IAttendence>({
    batchId: {
        type: Schema.Types.ObjectId,
        ref: 'batches',
        required: true,
    },
    studentsId: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }]
}, { timestamps: true });

const Attendence: Model<IAttendence> = mongoose.models.attendences || mongoose.model<IAttendence>("attendences", attendenceSchema);

export default Attendence;
