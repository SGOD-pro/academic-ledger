import connectDb from "@/db";
import examModel from "@/models/Exam";
import resultModel from "@/models/Result";

export async function POST(req: Request) {
	await connectDb();
	try {
		const url = new URL(req.url);
		const id = url.searchParams.get("id");
		const data = await req.json();
		if (!id) {
			return Response.json({ message: "Cann't get id" }, { status: 409 });
		}
		const exam = await examModel.findById(id);
		if (!exam) {
			return Response.json({ message: "Cann't get exam" }, { status: 404 });
		}
		console.log(data);
		const exists = await resultModel.findOne({ examId: exam._id });
		if (exists) {
			await resultModel.findByIdAndUpdate(exists._id, {
				$set: {
					result: data,
				},
			});
			return Response.json(
				{ message: "Marks updated successfuly" },
				{ status: 200 }
			);
		}
		const result = await resultModel.create({
			examId: exam._id,
			result: data,
		});
		return Response.json(
			{ message: "Marks added successfuly" },
			{ status: 200 }
		);
	} catch (error: any) {
		return Response.json({ message: error.message }, { status: 500 });
	}
}
