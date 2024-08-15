import {
	BatchInterface,
	SubjectInterface,
	SelectInterface,
} from "@/interfaces";
interface ReturnType {
	subject: SelectInterface;
	batch: SelectInterface;
}
export const filterBatches = (
	batchData: BatchInterface[],
	subjectData: SubjectInterface[]
): ReturnType | null => {
	const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const currentDay = daysOfWeek[new Date().getDay()];
	const currentTime = new Date();
	const updatedTime: any = new Date(
		currentTime.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000
	);

	const filteredBatches = batchData.filter((batch) => {
		const batchDays = batch.days.split(", ").map((day: any) => day.trim());
		if (!batchDays.includes(currentDay)) {
			return false;
		}

		const [startTime, endTime] = batch.time.split(" - ").map((time: any) => {
			const [hours, minutes] = time.split(":");
			const date = new Date();
			date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
			return date;
		});
		return updatedTime > startTime && endTime < updatedTime;
	});

	if (filteredBatches.length === 0) return null;

	let recentBatch = filteredBatches[0];
	let minDifference = Infinity;
	filteredBatches.forEach((batch) => {
		const endTime = batch.time.split(" - ")[1];
		const [hours, minutes] = endTime.split(":");
		const endDate = new Date();
		endDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
		const endTimeDiff: any = new Date(
			endDate.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000
		);
		const difference = Math.abs(updatedTime - endTimeDiff);
		if (difference < minDifference) {
			minDifference = difference;
			recentBatch = batch;
		}
	});
	const subject: SelectInterface = { code: "", name: "" };
	for (let index = 0; index < subjectData.length; index++) {
		const element = subjectData[index].subject;
		if (element === recentBatch.subject) {
			subject.code = subjectData[index]._id;
			subject.name = element;
			break;
		}
	}
	// 'Sun, Tue, Fri (07:30 - 10:00)'
	// 07:30 - 10:00
	const batchName=recentBatch.days+" ("+recentBatch.time+")"
	// console.log(recentBatch.days)
	const batch: SelectInterface = {
		code: recentBatch._id,
		name: batchName,
	};
	return { subject, batch };
};
