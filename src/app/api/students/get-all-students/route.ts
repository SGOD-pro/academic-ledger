import ConnectDB from "@/db";
import userModel from "@/models/StudentModel";

export async function GET(req: Request) {
	await ConnectDB();
	try {
		const url = new URL(req.url);
		let page: string | null = url.searchParams.get("page");
		let subject: string | null = url.searchParams.get("subject");
		let skipNumber: number = 0;
		let noOfdata: number = 25;

		if (page !== null) {
			skipNumber = noOfdata * (parseInt(page, 10));
		}
		console.log(page,skipNumber);
		const matchStage =
			subject && subject !== "null" ? { $match: { subjects: subject } } : null;
		const pipeline: any[] = [];

		if (matchStage) {
			pipeline.push(matchStage);
		}

		pipeline.push(
			{
				$unwind: "$subjects",
			},
			{
				$lookup: {
					from: "batches",
					localField: "subjects",
					foreignField: "subject",
					as: "subjectWiseBatches",
					pipeline: [
						{
							$project: {
								startTime: 0,
								endTime: 0,
							},
						},
					],
				},
			},
			{
				$group: {
					_id: "$_id",
					name: {
						$first: "$name",
					},
					clg: {
						$first: "$clg",
					},
					phoneNo: {
						$first: "$phoneNo",
					},
					stream: {
						$first: "$stream",
					},
					institutionName: {
						$first: "$institutionName",
					},
					fees: {
						$first: "$fees",
					},
					admissionNo: {
						$first: "$admissionNo",
					},
					subjects: {
						$push: "$subjects",
					},
					subjectWiseBatches: {
						$push: "$subjectWiseBatches",
					},
					picture: {
						$first: "$picture",
					},
					admissionDate: {
						$first: "$admissionDate",
					},
				},
			},
			{ $sort: { _id: -1 } },
			{ $skip: skipNumber },
			{ $limit: noOfdata },
			{
				$addFields: {
					subjects: {
						$reduce: {
							input: "$subjects",
							initialValue: "",
							in: {
								$concat: [
									"$$value",
									{ $cond: [{ $eq: ["$$value", ""] }, "", ", "] },
									"$$this",
								],
							},
						},
					},
				},
			}
		);
		const allUsers = await userModel.aggregate(pipeline);
		console.log(allUsers.length)
		return Response.json({
			success: true,
			data: allUsers,
			message: "All students fetched successfully",
		});
	} catch (error) {
		console.log(error);

		return Response.json(
			{ success: false, message: "Cann't get the student informations" },
			{ status: 500 }
		);
	}
}
