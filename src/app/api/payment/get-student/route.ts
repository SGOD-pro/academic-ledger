import connectDb from "@/db";
import feesModel from "@/models/FeesModel";
import studentModel from "@/models/StudentModel";
import mongoose from "mongoose";

export async function GET(req: Request) {
	await connectDb();
	try {
		const url = new URL(req.url);
		const id = url.searchParams.get("id");
		if (!id) {
			return Response.json({ message: "Cannot get id" }, { status: 400 });
		}
		const std = await studentModel.findOne({ admissionNo: id }).select("-batches -subjects -picture -stream -clg -presentByBatch -phoneNo -institutionName -presents -updatedAt");
		if (!std) {
			return Response.json({ message: "Cannot get student" }, { status: 404 });
		}
		let month = new Date(std.admissionDate);
		let firstPaid=true;
		const studentExists = await feesModel.findOne(
			{ studentId:new mongoose.Types.ObjectId(std._id)  },
			null,
			{ sort: { paidMonth: -1 } }
		);
		
		if (studentExists) {
			const latestPaidMonth = new Date(studentExists.paidMonth);
			month = latestPaidMonth
			firstPaid=false;
			month.setMonth(month.getMonth() + 1);
		}
		
		return Response.json(
			{
				message: "Fetched student record",
				success: true,
				data: {...std.toJSON(),month,firstPaid}
			},
			{ status: 200 }
		);
	} catch (error:any) {
		console.log(error);
		
		return Response.json(
			{
				message: error.message,
				success: false,
			},
			{ status: 500 }
		);
	}
}