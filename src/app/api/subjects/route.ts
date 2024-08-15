import { NextResponse, NextRequest } from "next/server";
import ConnectDB from "@/db";
import subjectModel from "@/models/Subjects";
import { capitalizeWords } from "@/helper/Capitalize";

export async function POST(req: NextRequest) {
	await ConnectDB();
	try {
		let reqBody = await req.json();
		for (const key in reqBody) {
			reqBody[key] = capitalizeWords(reqBody[key]);
		}
		const { subject } = reqBody;
		if (!subject || subject.trim() === "") {
			throw new Error("Invalid subject");
		}
		console.log(subject);

		const createdSub = await subjectModel.create({ subject });

		return NextResponse.json({
			message: "Added successfully",
			createdSub,
			status: true,
		});
	} catch (error: any) {
		return NextResponse.json({
			message: error.message,
			status: 500,
		});
	}
}
export async function GET(req: NextRequest) {
	await ConnectDB();
	try {
		const allSubjects = await subjectModel.find();
		return NextResponse.json({
			message: "Fetched subjects successfully",
			allSubjects,
			status: true,
		});
	} catch (error: any) {
		return NextResponse.json({
			message: error.message,
			status: 500,
		});
	}
}
