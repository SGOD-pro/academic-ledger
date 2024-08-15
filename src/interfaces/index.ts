export interface ToastInterface {
	summary: string;
	detail: string;
	type: "success" | "warn" | "error" | "info";
}
export type StudentDetailsInterface = {
	admissionNo: string;
	institutionName: string;
	picture: string | null | File;
	subjects: string[] | null | string;
	name: string;
	clg: boolean;
	stream: string;
	fees: number;
	phoneNo: string[] | null;
	admissionDate?: Date | null;
	_id?: string;
};

export interface SelectInterface {
	name: string;
	code?: string;
}

export interface PaymentFormInterface {
	_id: string;
	name: string;
	admissionNo: string;
	fees: number;
	firstPaid: boolean;
	month: Date; // Use `Date` type if you plan to work with Date objects
}

export type DeleteFunction = (id: string) => Promise<boolean>;

export type EditFunction = (data: any) => void;
export type NormalEditFunction = () => void;

export interface ExamProps {
	title: string;
	caption: string;
	batch?: { name: string; code: string } | null;
	date: Date | null;
	mode?: boolean;
	fullMarks: number | null;
}
export interface Batch {
	subject: { name: string } | null;
	startTime: Date | null;
	endTime: Date | null;
	days: string[];
}

export interface BatchInterface {
	_id: string;
	time: string;
	days: string;
	subject: string;
}
export interface SubjectInterface {
	_id: string;
	subject: string;
}
export interface AddAssignmentInterface {
	fileURL: string | null;
	explanation: string | null;
	_id: string;
	subject: string;
	submissionDate: Date;
	issue: Date;
}
