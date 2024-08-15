import mongoose, { Document, Schema, ObjectId } from "mongoose";

interface Marks extends Document {
	studentId: ObjectId;
	marks: number;
}
interface Result extends Document {
	examId: ObjectId;
	result: Marks[];
}

const resutlSchema: Schema<Result> = new Schema({
	examId: {
		type: Schema.Types.ObjectId,
		ref: "exams",
		unique: true,
	},
	result: [],
});
const resultModel =
	(mongoose.models.results as mongoose.Model<Result>) ||
	mongoose.model<Result>("results", resutlSchema);
export default resultModel;
