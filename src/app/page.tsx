"use client";
import Link from "next/link";
import {
	lazy,
	Suspense,
	useState,
	useMemo,
	useRef,
	useCallback,
	useEffect,
	memo,
} from "react";
const AddStudent = lazy(() => import("@/components/AddStudent"));
const AddSubject = lazy(() => import("@/components/AddSubject"));
const ExamForm = lazy(() => import("@/components/ExamForm"));
const SimpleCard = lazy(() => import("@/components/SimpleCard"));
const Table = lazy(() => import("@/components/ui/Table"));
import { popHomeStudents } from "@/toolkit/slices";
import { StudentDetailsInterface, SelectInterface } from "@/interfaces";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import useToast from "@/hooks/ToastHook";
import { RootState } from "@/toolkit";
import { toArray } from "@/helper/Array";
import { setHomeStudents,setAdmissionNo,updateAdmissionNo } from "@/toolkit/slices";
import Loading from "@/components/ui/Loading";
import { latestAdmissionNo, formatData } from "@/helper/FormatStdDetails";
import LazyLoading from "@/components/ui/LazyLoading";
interface ActionComponentProps {
	rowData: StudentDetailsInterface;
}
const columns = [
	{ field: "admissionNo", header: "Admission No" },
	{ field: "name", header: "Full name" },
	{ field: "subjects", header: "Subjects" },
];
export default function Home() {
	const [update, setUpdate] = useState(false);
	const subject = useRef<SelectInterface[] | null>(null);
	const dispatch = useDispatch();
	const { show } = useToast();
	const [values, setValues] = useState<StudentDetailsInterface>({
		admissionNo: "",
		institutionName: "",
		picture: null,
		subjects: [],
		name: "",
		clg: false,
		stream: "",
		fees: 0,
		phoneNo: [],
		admissionDate: new Date(),
	});
	const students = useSelector(
		(state: RootState) => state.Students.homeStudents
	);
	const data = useMemo(() => toArray(students), [students]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (data && data.length === 0) {
			setLoading(true);
			axios
				.get("/api/students/curd")
				.then((response) => {
					dispatch(setHomeStudents(response.data.data));
					if (response.data.data[0]?.admissionNo) {
						dispatch(updateAdmissionNo(response.data.data[0].admissionNo))
						const adno = latestAdmissionNo(response.data.data[0].admissionNo);
						localStorage.setItem("adno", adno);
						setValues((prev) => ({
							...prev,
							admissionNo: adno,
						}));
					}
					show({
						type: "success",
						summary: "Fetched",
						detail: "Successfully fetched students",
					});
				})
				.catch((error) => {
					console.log(error);
					show({
						type: "error",
						summary: "Error",
						detail: error.response?.data?.message || "Server error",
					});
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			setLoading(false);
			const adno = latestAdmissionNo(data[0].admissionNo);
			setValues((prev) => ({
				...prev,
				admissionNo: adno,
			}));
			localStorage.setItem("adno", adno);
		}
	}, [data, dispatch, show]);

	const editFunction = useCallback((rowData: StudentDetailsInterface) => {
		const formated = formatData(rowData);
		setValues(formated.formatedData);
		subject.current = formated.subjectList;
		if (rowData._id) localStorage.setItem("_id", rowData._id);
		setUpdate(true);
	}, []);

	const ActionComponent: React.FC<ActionComponentProps> = memo(
		({ rowData }) => {
			const id = rowData._id;
			const [disabled, setDisabled] = useState(false);
	
			const deleteFunction = useCallback(
				async (id: string) => {
					try {
						setDisabled(true);
						const response = await axios.delete(`/api/students/curd?id=${id}`);
						// Handle success
						show({
							summary: "DELETED",
							type: "info",
							detail: response.data.message || "Deleted successfully.",
						});
						dispatch(popHomeStudents(id));
					} catch (error: any) {
						// Handle error
						show({
							summary: "Not Deleted",
							type: "error",
							detail:
								error.response?.data?.message ||
								error.message ||
								"Server error while deleting",
						});
					} finally {
						setDisabled(false);
					}
				},
				[dispatch, show] // Ensure dependencies are correct
			);
	
			if (!id) {
				return null;
			}
	
			return (
				<div className="flex gap-1">
					<button
						className="bg-gradient-to-tl to-red-400 from-red-600 shadow-rose-800/90 shadow-lg hover:shadow-none hover:scale-95 transition-all rounded-r-sm rounded-l-xl p-3 grid place-items-center"
						onClick={() => deleteFunction(id)}
						disabled={disabled}
					>
						{disabled ? (
							<i className="pi pi-spin pi-spinner"></i>
						) : (
							<i className="pi pi-trash"></i>
						)}
					</button>
					<button
						className="bg-gradient-to-tl to-emerald-400 from-emerald-800 shadow-emerald-800/90 shadow-lg hover:shadow-none hover:scale-95 transition-all rounded-l-sm rounded-r-xl p-3 grid place-items-center"
						onClick={() => editFunction(rowData)}
					>
						<i className="pi pi-pen-to-square"></i>
					</button>
				</div>
			);
		}
	);
	
	ActionComponent.displayName = 'ActionComponent';
	
	return (
		<div className="grid grid-cols-1 lg:grid-cols-[2.5fr,1fr] h-full md:overflow-hidden overflow-auto custom-scrollbar gap-3">
			<div className="fixed right-4 top-3 z-40 grid cursor-pointer place-items-center w-10 h-10 bg-cyan-400 rounded-full">
				<i className="pi pi-bell relative text-xl "></i>
				<span className="animate-ping absolute h-full w-full rounded-full bg-sky-400 opacity-75"></span>
			</div>

			<section className="grid grid-rows-2 gap-3 overflow-y-auto overflow-x-hidden">
				<section className="rounded-lg sm:rounded-tl-[20px] md:rounded-tl-[44px] border border-slate-400/70 p-3 md:p-3 md:pl-8 relative overflow-y-auto overflow-x-hidden custom-scrollbar">
					<Suspense fallback={<LazyLoading />}>
						<div className="">
							<AddStudent
								studentData={values}
								update={update}
								setUpdate={setUpdate}
								subject={subject.current}
							/>
						</div>
					</Suspense>
				</section>

				<div className=" overflow-auto sm:rounded-bl-[20px] rounded-lg md:rounded-bl-[44px] border border-slate-400/70 relative custom-scrollbar bg-[#1F2937]">
					<section className=" ">
						<header className="flex items-center justify-between px-3 h-10 border-b sticky top-0 z-10 bg-[#1F2937]">
							<h2 className="text-xl capitalize font-semibold ">
								recent students
							</h2>
							<Link
								href="/all/all-students"
								className="text-emerald-500 text-sm underline"
							>
								All student
							</Link>
						</header>

						<Suspense fallback={<LazyLoading />}>
							<Loading loading={loading}>
								<Table
									columns={columns}
									values={data}
									Components={ActionComponent}
								/>
							</Loading>
						</Suspense>
					</section>
				</div>
			</section>
			<section className="hidden lg:grid lg:grid-rows-[.5fr,1fr,3.5fr] gap-2 relative rounded-lg overflow-auto custom-scrollbar">
				<div className="w-full relative border border-slate-400/60 rounded-lg">
					<Suspense fallback={<LazyLoading />}>
						<SimpleCard />
					</Suspense>
				</div>
				<div className="w-full relative border border-slate-400/60 rounded-lg p-2">
					<h2 className="text-lg font-semibold">Add Subject</h2>
					<Suspense fallback={<LazyLoading />}>
						<AddSubject />
					</Suspense>
				</div>
				<div className="w-full relative border border-slate-400/60 rounded-lg p-2">
					<h2 className="text-lg font-semibold">Add Exam</h2>
					<Suspense fallback={<LazyLoading />}>
						<ExamForm />
					</Suspense>
				</div>
			</section>
		</div>
	);
}
