import ConnectDB from "@/db";
import studentModel from "@/models/StudentModel";
import mongoose from "mongoose";

export async function POST(req: Request) {
	await ConnectDB();
	try {
		console.log("post");

		const body = await req.json();
		const { batches } = body;
		const batchIds = batches.map(
			(batchId: string) => new mongoose.Types.ObjectId(batchId)
		);
		console.log(batchIds);

		const url = new URL(req.url);
		const id = url.searchParams.get("id");
		console.log(id);
		if (!id) {
			throw new Error("Id not found");
		}

		const user = await studentModel.findById(id);
		if (!user) {
			return Response.json(
				{ success: false, message: "user not found" },
				{ status: 404 }
			);
		}
		user.batches = batchIds;
		const savedStd = await user.save();
		// console.log(savedStd);
		return Response.json(
			{ success: true, message: "Batches saved" },
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);

		return Response.json(
			{ success: false, message: "Server error cann't save batches." },
			{ status: 500 }
		);
	}
}

export async function GET(req: Request) {
	await ConnectDB();

	const url = new URL(req.url);
	const id = url.searchParams.get("id");
	if (!id) {
		return Response.json(
			{ success: false, message: "Student not found." },
			{ status: 404 }
		);
	}
	try {
		await ConnectDB();
		console.log("get batches", id);

		const response = await studentModel.aggregate([
			{ $match: { _id: new mongoose.Types.ObjectId(id) } },
			{
				$unwind: "$batches",
			},
			{
				$addFields: {
					batches: {
						$toObjectId: "$batches",
					}, // Convert string IDs to ObjectId
				},
			},
			{
				$lookup: {
					from: "batches",
					localField: "batches",
					foreignField: "_id",
					as: "batch",
					pipeline: [
						{
							$addFields: {
								days: {
									$reduce: {
										input: "$days",
										initialValue: "",
										in: {
											$concat: [
												"$$value",
												{
													$cond: [{ $eq: ["$$value", ""] }, "", ", "],
												},
												"$$this",
											],
										},
									},
								},
							},
						},
						{
							$addFields: {
								time: { $concat: ["$startTime", " - ", "$endTime"] },
							},
						},
						{
							$addFields: {
								days: { $concat: ["$days", " (", "$time", ")"] },
							},
						},
						{
							$project: {
								days: 1,
								subject: 1,
							},
						},
					],
				},
			},
			{
				$addFields: {
					batch: { $first: "$batch" },
				},
			},
			{
				$group: {
					_id: "$_id",
					batch: { $push: "$batch" },
				},
			},
		]);

		console.log(response);
		if (response.length === 0) {
			return Response.json({ success: false }, { status: 201 });
		}
		const data: any = {};
		response[0].batch.map((batch: any) => {
			data[batch.subject] = { code: batch._id, name: batch.days };
		});
		console.log(data);
		return Response.json(
			{ success: true, message: "Batches found", data },
			{ status: 200 }
		);
	} catch (error) {
		return Response.json(
			{ success: false, message: "Cann't get student details.Server error!" },
			{ status: 500 }
		);
	}
}
