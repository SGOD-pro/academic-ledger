import mongoose, { Schema, Document, ObjectId } from "mongoose";

interface Presentbatch extends Document {
	batchId: Schema.Types.ObjectId;
	presents: number;
}
export interface StudentSchemaInterface extends Document {
	name: string;
	phoneNo: string[] | null;
	picture: string | null;
	subjects: string[] | null;
	batches: Schema.Types.ObjectId[];
	presentByBatch: Presentbatch[];
	institutionName: string;
	admissionNo: string;
	presents?: number;
	clg: boolean;
	stream: string;
	fees: number;
	_id?:string;
	admissionDate: Date;
}

const StudentSchema: Schema<StudentSchemaInterface> = new Schema({
	name: {
		type: String,
		required: [true, "Name is required"],
	},
	institutionName: {
		type: String,
		required: [true, "Institution name is required"],
	},
	phoneNo: {
		type: [String],
		required: [true, "At least one phone number is required"],
	},
	picture: {
		type: String,
	},
	subjects: {
		type: [String],
		required: [true, "At least one subject is required"],
	},
	batches: {
		type: [Schema.Types.ObjectId],
		ref: "batches",
		default:[]
	},
	presentByBatch:[],
	admissionNo: {
		type: String,
		required: [true, "Admission number is required"],
	},
	presents: {
		type: Number,
		default: 0,
	},
	clg: {
		type: Boolean,
		required: [true, "Clg is required"],
	},
	stream: {
		type: String,
		required: [true, "Stream is required"],
	},
	fees: {
		type: Number,
		required: [true, "Fees is required"],
		default: 0,
	},
	admissionDate: {
		type: Date,
		dufault: new Date(),
	},
});
StudentSchema.pre("save", function (next) {
	console.log("save middleware triggered");

	const student = this as StudentSchemaInterface;

	if (!student.isModified("batches")) {
		console.log("No modifications to 'batches', skipping middleware");
		return next();
	}

	console.log("Modifications detected in batches");

	const presentByBatchMap = new Map(
		student.presentByBatch.map((pb) => [pb.batchId.toString(), pb])
	);

	// student.batches.forEach((batchId) => {
	// 	if (!presentByBatchMap.has(batchId.toString())) {
	// 		student.presentByBatch.push({
	// 			batchId: batchId,
	// 			presents: 0,
	// 		});
	// 	}
	// });

	console.log("Updated presentByBatch", student.presentByBatch);
	next();
});

const studentModel =
	(mongoose.models.students as mongoose.Model<StudentSchemaInterface>) ||
	mongoose.model<StudentSchemaInterface>("students", StudentSchema);

export default studentModel;
