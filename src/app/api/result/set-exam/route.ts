import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import examModel from "@/models/Exam";
import connectDb from "@/db";

export async function POST(req: NextRequest) {
	await ConnectDB();
	try {
		const { title, caption, batch, date, fullMarks, mode } = await req.json();
		const created = await examModel.create({
			title,
			caption,
			batch,
			date,
			marks: fullMarks,
			online: mode,
		});
		if (!created) {
			return NextResponse.json(
				{ message: "Error to adding exam", success: false },
				{ status: 409 }
			);
		}
		return NextResponse.json({
			message: "Exam added",
			data: created,
			success: true,
		});
	} catch (error: any) {
		console.log(error);
		return NextResponse.json({ message: error.message }, { status: 500 });
	}
}
export async function GET() {
	await connectDb();
	try {
		const data = await examModel.aggregate([
			{
				$lookup: {
					as: "batch",
					foreignField: "_id",
					from: "batches",
					localField: "batch",
					pipeline: [
						{
							$addFields: {
								time: {
									$concat: ["$startTime", " - ", "$endTime"],
								},
								days: {
									$reduce: {
										input: "$days",
										initialValue: "",
										in: {
											$concat: ["$$value", ", ", "$$this"],
										},
									},
								},
							},
						},
						{
							$project: {
								_id: 1,
								time: 1,
								subject: 1,
								days: {
									$cond: {
										if: {
											$eq: ["$days", ""],
										},
										then: "",
										else: {
											$substrCP: [
												"$days",
												2,
												{
													$subtract: [
														{
															$strLenCP: "$days",
														},
														1,
													],
												},
											],
										},
									},
								},
							},
						},
					],
				},
			},
			{
				$addFields: {
					batch: {
						$arrayElemAt: ["$batch", 0],
					},
					date: {
						$dateToString: {
							format: "%d-%m-%Y",
							date: "$date",
						},
					},
				},
			},
			{
				$project: {
					subject: "$batch.subject",
					batch_name: {
						$concat: ["$batch.days", "(", "$batch.time", ")"],
					},
					date: "$date",
				},
			},
		]);
		return Response.json({ message: "Done", data }, { status: 201 });
	} catch (error: any) {
		return Response.json({ message: error.message }, { status: 500 });
	}
}
