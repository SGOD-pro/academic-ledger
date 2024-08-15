import connectDb from "@/db";
import Assignment from "@/models/Assignment";

export async function GET(req: Request) {
	await connectDb();
	try {
		const url = new URL(req.url);
		const id = url.searchParams.get("id");
		if (!id) {
			return Response.json(
				{
					success: false,
					message: "Cann't get id!",
					data: ` <h1 className=" text-3xl capitalize font-semibold mx-auto"> not found</h1>`,
				},
				{ status: 400 }
			);
		}

		const data = await Assignment.findById(id);
		if (!data) {
			return Response.json(
				{
					success: false,
					message: "Cann't get assignment details!",
					data: ` <h1 className=" text-3xl capitalize font-semibold mx-auto"> not found</h1>`,
				},
				{ status: 409 }
			);
		}

		return Response.json(
			{ success: true, message: "Fetched Data!", data: data.content },
			{ status: 200 }
		);
	} catch (error) {
		return Response.json(
			{
				success: false,
				message: "Cann't get assignment details!",
				data: ` <h1 className=" text-3xl capitalize font-semibold mx-auto"> not found</h1>`,
			},
			{ status: 500 }
		);
	}
}
