import mongoose from "mongoose";

type ConnectionObject = {
	isConnected?: number;
};

const connection: ConnectionObject = {};

export default async function connectDb(): Promise<void> {
	if (connection.isConnected) {
		console.log("Already connected.");
		return;
	}
	try {
		const con = await mongoose.connect(process.env.MONGO_URI!);
		con.connection.on("error", () => {
			console.log("Mongoose connection error");
		});
		con.connection.on("connection", () => {
			console.log("Mongodb connected.");
		});
		connection.isConnected = con.connections[0].readyState;
	} catch (error) {
		console.log("Server error: " + error);
		process.exit(1);
	}
}
