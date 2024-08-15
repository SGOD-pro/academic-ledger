import connectDb from "@/db";
import examModel from "@/models/Exam";
import resultModel from "@/models/Result";
import mongoose from "mongoose";

export async function GET(req: Request) {
	await connectDb();
	try {
		const url = new URL(req.url);
		const id = url.searchParams.get("id");
		if (!id) {
			return Response.json({ message: "Cannot get id" }, { status: 409 });
		}
		const exists = await resultModel.aggregate([
			{ $match: { examId: new mongoose.Types.ObjectId(id) } },
			{
				$project: {
					result: {
						$arrayToObject: {
							$map: {
								input: "$result",
								as: "r",
								in: {
									k: "$$r.studentId",
									v: "$$r.marks",
								},
							},
						},
					},
				},
			},
		]);
		const data = await examModel.aggregate([
			{
				$match: { _id: new mongoose.Types.ObjectId(id) },
			},
			{
				$lookup: {
					from: "students",
					localField: "batch",
					foreignField: "batches",
					as: "students",
					pipeline: [
						{
							$project: {
								name: 1,
								admissionNo: 1,
								picture: 1,
							},
						},
					],
				},
			},
			{
				$lookup: {
					from: "batches",
					localField: "batch",
					foreignField: "_id",
					as: "subject",
					pipeline: [
						{
							$project: {
								subject: 1,
							},
						},
					],
				},
			},
			{
				$addFields: {
					date: {
						$dateToString: {
							format: "%d-%m-%Y",
							date: "$date",
						},
					},
					subject: { $arrayElemAt: ["$subject", 0] },
				},
			},
			{
				$project: {
					students: 1,
					subject: "$subject.subject",
					date: 1,
					marks: 1,
				},
			},
		]);
		if (!data) {
			return Response.json(
				{ message: "Cannot get Exam details" },
				{ status: 400 }
			);
		}
		console.log(exists);
		
		return Response.json(
			{
				message: "Fetched",
				data: data[0],
				exists: exists.length>0 ? true : false,
				marks: exists[0],
			},
			{ status: 200 }
		);
	} catch (error: any) {
		return Response.json({ message: error.message }, { status: 500 });
	}
}
