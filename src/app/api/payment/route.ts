import connectDb from "@/db";
import feesModel from "@/models/FeesModel";
import studentModel from "@/models/StudentModel";
import { getMonthName, getNextMonth } from "@/helper/DateTime";
import mongoose from "mongoose";

export async function GET(req: Request) {
	await connectDb();
	try {
		const url = new URL(req.url);
		const id = url.searchParams.get("id");
		if (!id) {
			return Response.json(
				{ message: "Connot get id", success: false },
				{ status: 404 }
			);
		}
		const admissionAt = await studentModel.aggregate([
			{ $match: { admissionNo: id } },
			{
				$project: {
					admissionDate: 1,
					name:1
				},
			},
		]);
		if (admissionAt.length === 0) {
			return Response.json(
				{
					message: "Cann't find student",
					success: false,
				},
				{ status: 404 }
			);
		}
		const lastFees = await feesModel.aggregate([
			{ $match: { studentId: admissionAt[0]._id } },
			{
				$group: {
					_id: null,
					dates: {
						$push: "$createdAt",
					},
				},
			},
			{ $project: { _id: 0, dates: 1 } },
		]);

		console.log(admissionAt[0].admissionDate);
		console.log(lastFees.length > 0 ? lastFees[0].dates : undefined);
		return Response.json(
			{
				message: "New student",
				success: true,
				data: {
					admissionDate: admissionAt[0].admissionDate,
					feesPaidDetails: lastFees.length > 0 ? lastFees[0].dates : undefined,
					name:admissionAt[0].name
				},
			},
			{ status: 200 }
		);
	} catch (error: any) {
		console.log(error);

		return Response.json(
			{
				message: error.message || "Connot get the fees record",
				success: false,
			},
			{ status: 500 }
		);
	}
}

export async function POST(req: Request) {
	await connectDb();
	try {
		const url = new URL(req.url);
		const _id = url.searchParams.get("id");
		const { months, date } = await req.json();
		console.log({ months, date });
		if (!_id) {
			return Response.json({ message: "Cannot get id" }, { status: 403 });
		}
		const std = await studentModel.findById(_id);
		if (!std || !std._id) {
			return Response.json({ message: "Cannot get student" }, { status: 404 });
		}
		const exists = await feesModel.aggregate([
			{ $match: { studentId: new mongoose.Types.ObjectId(std._id) } },
			{ $sort: { paidMonth: -1 } },
			{ $limit: 1 },
		]);
		let month = std.admissionDate;
		if (exists.length > 0) {
			const latestPaidMonth = getNextMonth(exists[0].paidMonth);
			month = latestPaidMonth;
		}
		let paidFeesArray = [];
		for (let i = 0; i < months; i++) {
			paidFeesArray.push({
				studentId: std._id,
				paidMonth: month,
				createdAt: date,
			});
			month = getNextMonth(month);
		}
		console.log(paidFeesArray);

		const paidFees = await feesModel.insertMany(paidFeesArray);

		const paidMonth = new Date(paidFees[months - 1].paidMonth.getTime());

		return Response.json(
			{
				message:
					months === 1
						? `${getMonthName(paidMonth)} Payment successfully`
						: "Payment successfully",
			},

			{ status: 201 }
		);
	} catch (error: any) {
		console.log(error);

		return Response.json(
			{ message: error.message || "Payment unsuccessful", success: false },
			{ status: 500 }
		);
	}
}
