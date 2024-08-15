import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import batchModel from "@/models/Batches";
import { extractTime } from "@/helper/DateTime";

export async function GET(req: NextRequest) {
	await ConnectDB();
	try {
		const allBatches = await batchModel.aggregate([
			{
				$sort: { subject: 1 },
			},

			{
				$addFields: {
					time: {
						$concat: ["$startTime", " - ", "$endTime"],
					},
					days: {
						$reduce: {
							input: "$days",
							initialValue: "",
							in: { $concat: ["$$value", ", ", "$$this"] },
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
							if: { $eq: ["$days", ""] },
							then: "",
							else: {
								$substrCP: [
									"$days",
									2,
									{ $subtract: [{ $strLenCP: "$days" }, 1] },
								],
							},
						},
					},
				},
			},
		]);
		return NextResponse.json({
			message: "Fetched subjects successfully",
			allBatches,
			status: true,
		});
	} catch (error: any) {
		return NextResponse.json({
			message: error.message,
			status: 500,
		});
	}
}

export async function POST(req: NextRequest) {
	await ConnectDB();
    console.log("post")
	try {
		const { subject, endTime, startTime, days } = await req.json();
		if ([subject.name, endTime, startTime].some((x) => !x || x.trim() === "")) {
			return Response.json(
				{ message: "Cannot get proper data" },
				{ status: 401 }
			);
		}
		const sTime = extractTime(startTime);
		const eTime = extractTime(endTime);
		const exists = await batchModel.aggregate([
			{ $unwind: "$days" },
			{
				$match: {
					days: { $in: days },
					subject: subject.name,
					startTime: sTime,
				},
			},
		]);

		if (exists.length > 0) {
			return NextResponse.json(
				{
					message: "Already have same batch!",
					success: false,
				},
				{ status: 400 }
			);
		}
		const data = await batchModel.create({
			subject: subject.name,
			startTime: sTime,
			endTime: eTime,
			days,
		});

		const modifiedData = {
			_id: data._id,
			subject: data.subject,
			time: data.startTime + " - " + data.endTime,
			days: data.days?.join(","),
		};

		return NextResponse.json({
			message: "success",
			data: modifiedData,
			status: true,
		});
	} catch (error: any) {
		return NextResponse.json(
			{ message: error.message || "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function DELETE(req: NextRequest) {
	await ConnectDB();
	try {
		const url = new URL(req.url);
		const _id = url.searchParams.get("id");
		if (!_id) {
			return Response.json(
				{ message: "Invalid id", success: "false" },
				{ status: 404 }
			);
		}
		const batch = await batchModel.findById(_id);
		if (!batch) {
			const error: any = new Error("Could not find");
			error.status = 404;
			throw error;
		}
		console.log(`Batch found: ${batch}`);
		await batch.deleteOne();
		return NextResponse.json({ message: "Deleted", _id, status: true });
	} catch (error: any) {
		console.log(error);
		return NextResponse.json(
			{ error: error.message, status: false },
			{ status: 500 }
		);
	}
}

export async function PUT(req: NextRequest) {
	await ConnectDB();
	try {
        console.log("put");
        
		const { subject, endTime, startTime, days } = await req.json();
		const url = new URL(req.url);
		const _id = url.searchParams.get("_id");
		const data = await batchModel.findByIdAndUpdate(
			_id,
			{
				$set: {
					subject: subject.name,
					startTime: extractTime(startTime),
					endTime: extractTime(endTime),
					days,
				},
			},
			{ new: true }
		);
		if (!data) {
			return NextResponse.json({ message: "Cannot get the batch" }, { status: 404 });
		}
		const modifiedData = {
			_id: data._id,
			subject: data.subject,
			time: data.startTime + " - " + data.endTime,
			days: data.days?.join(","),
		};
		return NextResponse.json({
			message: "success",
			data: modifiedData,
			status: true,
		});
	} catch (error: any) {
        console.log(error);
		return NextResponse.json({ message: error.message }, { status: 500 });
	}
}