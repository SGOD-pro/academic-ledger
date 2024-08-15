import { StudentDetailsInterface } from "@/interfaces";
export function latestAdmissionNo(data: string): string {
	const lastDigit = data.split("-");
	return `CA-${new Date().getFullYear() % 100}/${
		(new Date().getFullYear() % 100) + 1
	}-${
		(lastDigit && Array.isArray(lastDigit) && +lastDigit[lastDigit.length - 1]
			? +lastDigit[lastDigit.length - 1]
			: 0) + 1
	}`;
}

export function formatData(data: StudentDetailsInterface) {
	const subjectList = data.subjects
		? typeof data.subjects === "string"
			? data.subjects.includes(",")
				? data.subjects.split(",").map((item: string): { name: string } => ({
						name: item.trim(),
				  }))
				: [{ name: data.subjects.trim() }]
			: data.subjects.map((item: string): { name: string } => ({
					name: item.trim(),
			  }))
		: [];

	let date = new Date();
	if (data.admissionDate) {
		date = new Date(data.admissionDate);
	}
	const formatedData = {
		institutionName: data.institutionName,
		admissionNo: data.admissionNo,
		picture: data.picture,
		subjects: data.subjects,
		name: data.name,
		clg: data.clg ? true : false,
		stream: data.stream,
		phoneNo: data.phoneNo,
		fees: data.fees,
		admissionDate: date,
		_id: data._id,
	};
	return { subjectList, formatedData };
}
