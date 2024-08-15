import userModel from "@/models/StudentModel";
import { NextResponse, NextRequest } from "next/server";
import { capitalizeWords } from "@/helper/Capitalize";
import ConnectDB from "@/db";
import formDataToJson from "@/helper/FormData";
import uploadImage from "@/helper/UploadColudinary";
import { StudentDetailsInterface } from "@/interfaces";

const jsonObject = (data: any): StudentDetailsInterface => {
	const object: StudentDetailsInterface = {
		name: capitalizeWords(data.name),
		phoneNo: data["phoneNo[]"],
		subjects: data["subject[]"],
		institutionName: data["institutionName"],
		admissionNo: data["admissionNo"],
		clg: data["clg"] === "true",
		stream: data["stream"],
		fees: parseFloat(data["fees"] || 0),
		admissionDate: data["admissionDate"],
		picture: null,
	};
	return object;
};

export async function POST(req: NextRequest) {
	await ConnectDB();
	try {
		const data = await req.formData();
		const file = data.get("picture");
		const jsonData = formDataToJson(data);
		const object = jsonObject(jsonData);
		const exists = await userModel.findOne({
			admissionNo: object.admissionNo,
		});
		const { name, admissionNo, stream, institutionName } = object;
		if (
			[name, admissionNo, stream, institutionName].some(
				(value) => value?.trim() === ""
			)
		) {
			return NextResponse.json(
				{ message: "Some attributes are missing", success: false },
				{ status: 400 }
			);
		}

		if (exists) {
			return NextResponse.json(
				{
					message: `Already admission no assigned to ${exists.name}.`,
					success: false,
				},
				{ status: 409 }
			);
		}
		if (file) {
			object.picture = await uploadImage(file);
		}

		const student = await userModel.create(object);
		const response = {
			...student.toJSON(),
			subjects: student?.subjects?.join(","),
		};
		const message =
			file && !student.picture
				? "Student add but image not uploaded."
				: "Student added successfully";
		return NextResponse.json(
			{
				message,
				data: response,
				success: file && !student.picture ? false : true,
			},
			{ status: 200 }
		);
	} catch (error: any) {
		console.log(error);

		return NextResponse.json(
			{
				message: error.message || "Cannot add student! Server error",
				success: false,
			},
			{ status: 500 }
		);
	}
}

export async function GET() {
	await ConnectDB();
	try {
		const users = await userModel.aggregate([
			{
				$sort: { _id: -1 },
			},
			{
				$limit: 4,
			},
			{
				$addFields: {
					subjects: {
						$reduce: {
							input: "$subjects",
							initialValue: "",
							in: { $concat: ["$$value", ",", "$$this"] },
						},
					},
				},
			},
			{
				$addFields: {
					subjects: {
						$substrCP: [
							"$subjects",
							1,
							{ $subtract: [{ $strLenCP: "$subjects" }, 1] },
						],
					},
				},
			},
		]);
		return NextResponse.json({
			message: "Fetched students...",
			data: users,
			status: 200,
		});
	} catch (error: any) {
		console.log(error);

		return NextResponse.json({ message: error.message, status: 500 });
	}
}

export async function DELETE(req: NextRequest) {
	await ConnectDB();
	try {
		const url = new URL(req.url);
		const _id = url.searchParams.get("id");
		console.log(_id);
		const deleted = await userModel.findByIdAndDelete(_id);
		if (!deleted) {
			const error: any = new Error("Could not find");
			error.status = 404;
			throw error;
		}
		return NextResponse.json({ message: "Deleted", _id, status: true });
	} catch (error: any) {
		console.log(error);
		return NextResponse.json(
			{ error: error.message, status: error.status },
			{ status: 500 }
		);
	}
}

export async function PUT(req: Request) {
	await ConnectDB();
	try {
		const url = new URL(req.url);
		const _id = url.searchParams.get("id");
		if (!_id) {
			return Response.json(
				{ message: "Student not found", success: false },
				{ status: 404 }
			);
		}
		const data = await req.formData();
		const object = jsonObject(data);
		const { name, admissionNo, stream, institutionName } = object;
		if (
			[name, admissionNo, stream, institutionName].some(
				(value) => value?.trim() === ""
			)
		) {
			return NextResponse.json(
				{ message: "Some attributes are missing", success: false },
				{ status: 400 }
			);
		}

		const userExists = await userModel.find({
			$or: [{ _id }, { admissionNo }],
		});
		if (userExists.length === 0 || userExists.length > 1) {
			return Response.json(
				{
					message:
						userExists.length > 1
							? "Duplicate admissionNo found."
							: "User not found ",
					success: false,
				},
				{ status: 400 }
			);
		}
		const file = data.get("picture");

		if (file) {
			object.picture = await uploadImage(file);
		}
		const user = await userModel.findByIdAndUpdate(
			_id,
			{
				$set: object,
			},
			{ new: true, runValidators: true }
		);

		if (!user) {
			throw new Error();
		}
		const response = {
			...user.toJSON(),
			subjects: user?.subjects?.join(","),
		};
		const message = object.picture
			? "Student added successfully"
			: file && !object.picture
			? "Student add but image not uploaded."
			: "Some other condition.";
		return NextResponse.json(
			{
				message,
				data: response,
				success: file && !object.picture ? false : true,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return Response.json(
			{
				message: "Cann't update student, Internal server error ",
				success: false,
			},
			{ status: 500 }
		);
	}
}
