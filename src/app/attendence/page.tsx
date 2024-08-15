"use client";
import useToast from "@/hooks/ToastHook";
import React, {
	lazy,
	memo,
	Suspense,
	useCallback,
	useEffect,
	useState,
} from "react";
import { filterBatches } from "@/helper/currentBatchFilter";
import Header from "@/components/ui/Header";
import LazyLoading from "@/components/ui/LazyLoading";
const Table = lazy(() => import("@/components/ui/Table"));
const SelectBatch = lazy(() => import("@/components/ui/SelectBatch"));
import { SelectInterface } from "@/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "@/toolkit";
import axios from "axios";
import Link from "next/link";
import "./checkbox.css";
interface RowData {
	_id: string;
	name: string;
	subject: string;
}
interface ComponentProps {
	rowData: RowData;
}
const columns = [
	{ field: "name", header: "Name" },
	{ field: "subject", header: "Subjects" },
];

function AttendencePage() {
	const { show } = useToast();
	const [batch, setBatch] = useState<SelectInterface | null>();
	const [subject, setSubject] = useState<SelectInterface | null>();
	const [studentData, setStudentData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [studentIds, setStudentIds] = useState<string[]>([]);

	const CheckboxComponent: React.FC<ComponentProps> = React.memo(
		({ rowData }: { rowData: RowData }) => {
			const { _id } = rowData;
			if (!_id) {
				return;
			}
			const handleCheckboxChange = (
				event: React.ChangeEvent<HTMLInputElement>
			) => {
				const { value, checked } = event.target;
				setStudentIds((prevIds) =>
					checked ? [...prevIds, value] : prevIds.filter((id) => id !== value)
				);
			};

			return (
				<div>
					<label className="container" htmlFor={_id}>
						<input
							type="checkbox"
							checked={studentIds.includes(_id)}
							onChange={handleCheckboxChange}
							value={_id}
							id={_id}
						/>
						<svg viewBox="0 0 64 64" height="2.3em" width="2.3em">
							<path
								d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
								pathLength="575.0541381835938"
								className="path"
							></path>
						</svg>
					</label>
				</div>
			);
		}
	);
CheckboxComponent.displayName="CheckboxComponent";
	// const sub = useRef<SelectInterface>()
	const fetchRecords = useCallback(
		async (PasedBatch: SelectInterface) => {
			console.log("fetching");
			setLoading(true);
			console.log(PasedBatch);

			if (!PasedBatch?.code) {
				show({
					summary: "BatchId 404",
					detail: "Cannot get batch",
					type: "info",
				});
				return;
			}
			setBatch(PasedBatch);
			try {
				//TODO: combine the routes file to set and get record in one route.ts file, also modify the interfaces of this file
				const [studentRecords, attendenceRecord] = await Promise.all([
					axios.get(`/api/attendence/get-students?id=${PasedBatch?.code}`),
					axios.get(`/api/attendence?id=${PasedBatch?.code}`),
				]);

				setStudentData(studentRecords.data.data);
				setStudentIds(attendenceRecord.data.data?.studentsId || []);
				setLoading(false);
			} catch (error: any) {
				setLoading(false);
				setBatch(null);
				setSubject(null);
				show({
					summary: "Attendance",
					detail:
						error.response?.data?.message ||
						error.message ||
						"Error fetching attendance!",
					type: "error",
				});
			}
		},
		[show, batch]
	);

	const subjects = useSelector(
		(state: RootState) => state.Subjects.allSubjects
	);
	const batches = useSelector((state: RootState) => state.Batches.allBatches);

	useEffect(() => {
		const returnData = filterBatches(batches, subjects);
		if (returnData) {
			const { batch, subject } = returnData;
			setBatch(batch);
			setSubject(subject);
			fetchRecords(batch);
		}
	}, [batches, subjects]);
	const setAttendence = useCallback(() => {
		console.log(batch); //NOTE: it probably returns null if there is an error to fetch records
		console.log(studentIds);
		if (!batch?.code) {
			show({
				summary: "BatchId 404",
				detail: "Cannot get batch",
				type: "error",
			});
			return;
		}
		axios
			.post(`/api/attendence`, { batchId: batch.code, studentsId: studentIds })
			.then((response) => {
				if (response.status < 400) {
					show({
						summary: "Added",
						detail: "Attendence saved",
						type: "success",
					});
				}
			});
	}, [studentIds]);

	return (
		<div className="w-full h-full rounded-lg sm:rounded-l-[20px] md:rounded-l-[44px] border border-slate-400/70 overflow-hidden">
			<Header title="SetAttendence">
				<Suspense fallback={<LazyLoading />}>
					<SelectBatch
						setBatchValue={setBatch}
						batchValue={batch}
						subjectValue={subject}
						batchChangeFunction={fetchRecords}
						// setSubjectValue={setSubject}
					/>
				</Suspense>
			</Header>
			<div className="w-full h-[calc(100%-3.5rem)] overflow-auto  custom-scrollbar relative space-y-2 p-3">
				<div className="text-right">
					<button
						className="bg-teal-500 hover:bg-teal-600 rounded-tr-xl rounded-bl-xl rounded-sm"
						onClick={setAttendence}
					>
						<i className="pi pi-save p-3"></i>
					</button>
				</div>
				<div className="w-full min-h-[calc-(100%-4rem)] bg-[#1f2937] rounded-md p-2 overflow-auto custom-scrollbar">
					<Table
						columns={columns}
						values={studentData}
						Components={CheckboxComponent}
					/>
				</div>
			</div>
			<Link
				href="/all/attendence"
				className="fixed bottom-10 right-10 md:right-16 backdrop-blur-md bg-slate-800/20 hover:bg-teal-400/40 border-teal-600 transition-colors rounded-2xl border"
			>
				<i className="pi pi-history text-2xl p-3 px-4"></i>
			</Link>
		</div>
	);
}

export default memo(AttendencePage);
