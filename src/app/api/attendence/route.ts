import ConnectDB from "@/db";
import attendenceModel from "@/models/Attendence";
import studentModel from "@/models/StudentModel";
import { arrayDifference } from "@/helper/Array";
import mongoose from "mongoose";

function convertToMongoId(array: string[]) {
	const objectIds = array.map((id: string) => new mongoose.Types.ObjectId(id));
	return objectIds;
}

export async function POST(req: Request) {
	ConnectDB();
	try {
		const { batchId, studentsId } = await req.json();
		console.log(studentsId);
		const startOfDay = new Date();
		startOfDay.setHours(0, 0, 0, 0);
		const endOfDay = new Date();
		endOfDay.setHours(23, 59, 59, 999);

		const data = await attendenceModel.findOne({
			batchId,
			createdAt: {
				$gte: startOfDay,
				$lte: endOfDay,
			},
		});

		const batchObjectId = new mongoose.Types.ObjectId(batchId);
		if (data) {
			const oldArray = data.studentsId;
			const newArray = studentsId;

			const { decrease, increase } = arrayDifference(oldArray, newArray);

			const decreaseIds = convertToMongoId(decrease);
			const increaseIds = convertToMongoId(increase);
			data.studentsId = studentsId;
			await data.save();

			await studentModel.updateMany(
				{ _id: { $in: decreaseIds }, "presentByBatch.batchId": batchObjectId },
				{ $inc: { "presentByBatch.$[elem].presents": -1 } },
				{ arrayFilters: [{ "elem.batchId": batchObjectId }] }
			),
				await studentModel.updateMany(
					{
						_id: { $in: increaseIds },
						"presentByBatch.batchId": batchObjectId,
					},
					{ $inc: { "presentByBatch.$[elem].presents": 1 } },
					{ arrayFilters: [{ "elem.batchId": batchObjectId }] }
				);

			return Response.json(
				{ success: true, message: "Attendence updated successfully." },
				{ status: 200 }
			);
		}
		await attendenceModel.create({
			batchId,
			studentsId,
		});
		const objectIds = convertToMongoId(studentsId);

		const result = await studentModel.updateMany(
			{ _id: { $in: objectIds }, "presentByBatch.batchId": batchObjectId },
			{ $inc: { "presentByBatch.$[elem].presents": 1 } },
			{ arrayFilters: [{ "elem.batchId": batchObjectId }] }
		);
		if (!result) {
			return Response.json(
				{ success: false, message: "Attendence not added" },
				{ status: 409 }
			);
		}
		return Response.json(
			{ success: true, message: "Attendence added successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return Response.json(
			{ success: false, message: "Cann't add attendence successfully" },
			{ status: 500 }
		);
	}
}

export async function GET(req: Request) {
	ConnectDB();
	try {
		const url = new URL(req.url);
		const batchId = url.searchParams.get("id");
		if (!batchId) {
			throw new Error("can't get batch id");
		}

		const startOfDay = new Date();
		startOfDay.setHours(0, 0, 0, 0);
		const endOfDay = new Date();
		endOfDay.setHours(23, 59, 59, 999);

		const data = await attendenceModel.findOne({
			batchId,
			createdAt: {
				$gte: startOfDay,
				$lte: endOfDay,
			},
		});
		console.log(data);

		return Response.json(
			{ success: true, message: "Fetched attendence record.", data },
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);

		return Response.json(
			{ success: false, message: "Cann't get attendence record" },
			{ status: 500 }
		);
	}
}
