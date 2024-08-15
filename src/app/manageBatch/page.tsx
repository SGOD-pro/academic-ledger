"use client";
import React, {
	memo,
	useState,
	useCallback,
	useEffect,
	useRef,
	useMemo,
	lazy,
	Suspense,
} from "react";
import { StudentDetailsInterface } from "@/interfaces";
import Popover from "@/components/ui/Popover";
const AddStudent = lazy(() => import("@/components/AddStudent"));
const SetBatchForm = lazy(() => import("@/components/SetBatchForm"));
const QueryTable = lazy(() => import("@/components/ui/QueryTable"));
import axios from "axios";
import { formatData } from "@/helper/FormatStdDetails";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import {
	setAllStudents,
	pushAllStudents,
	popAllStudents,
} from "@/toolkit/slices";
import { RootState } from "@/toolkit";
import { toArray } from "@/helper/Array";
import useToast from "@/hooks/ToastHook";
import Loader from "@/components/ui/Loader";
import LazyLoading from "@/components/ui/LazyLoading";
import Header from "@/components/ui/Header";
import { showToast } from "@/toolkit/slices/Toast";

interface ActionComponentProps {
	rowData: StudentDetailsInterface;
}
interface BatchInfo {
	name: string;
	code: string;
}

export interface Batches {
	[key: string]: BatchInfo;
}
const ActionComponent: React.FC<ActionComponentProps> = memo(({ rowData }) => {
	const [student, setStudent] = useState<StudentDetailsInterface>({
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
	const { show } = useToast();
	const [subject, setSubject] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const studentDetails = () => {
		const { subjectList, formatedData } = formatData(rowData);
		setStudent(formatedData);
		setSubject(subjectList);
	};

	const deleteRecord = useCallback(() => {
		const id = rowData._id;
		if (id) {
			return;
		}
		setLoading(true);
		axios
			.delete(`/api/student/curd?id=${id}`)
			.then((response) => {
				//TODO: check the deleteStudnet is it returning the deleted student id or not..
				popAllStudents(response.data.data);
			})
			.catch((error: any) => {
				show({
					detail:
						error?.response?.data?.message ||
						error.message ||
						"Internal server error",
					summary: "ERROR",
					type: "error",
				});
			});
	}, []);
	const [values, setValues] = useState<Batches>();
	const batchDetails = useCallback(() => {
		if (!rowData._id) {
			return;
		}
		studentDetails();
		axios
			.get(`/api/students/assign-batches?id=${rowData._id}`)
			.then((response) => {
				setValues(response.data.data);
				console.log(response.data.data)
				if (response.data.data) {
					show({
						summary: "Already have!",
						detail: "Already have batches",
						type: "info",
					});
				}
			})
			.catch((error) => {
				show({
					summary: "ERROR",
					detail:
						error?.response?.data?.message ||
						error.message ||
						"Internal server error",
					type: "error",
				});
			});
	}, []);

	return (
		<div>
			<div className="flex justify-end">
				<button className="rounded-lg shadow-xl active:shadow-none shadow-rose-800/80 active:scale-95 transition-all bg-rose-500 rounded-r-none">
					{!loading ? (
						<i className="pi pi-trash p-2 sm:p-3"></i>
					) : (
						<i className="pi pi-spin pi-spinner p-2 sm:p-3"></i>
					)}
				</button>
				<Popover
					icon={<i className="pi pi-user-edit p-2 sm:p-3"></i>}
					buttonClassName="rounded-none shadow-xl active:shadow-none shadow-cyan-800/80 active:scale-95 transition-all bg-cyan-500"
					buttonFunction={studentDetails}
				>
					<Suspense fallback={<LazyLoading />}>
						<AddStudent studentData={student} update={true} subject={subject} />
					</Suspense>
				</Popover>
				<Popover
					icon={<i className="pi pi-calendar-plus p-2 sm:p-3"></i>}
					buttonClassName="rounded-lg shadow-xl active:shadow-none shadow-teal-800/80 active:scale-95 transition-all bg-teal-500 rounded-l-none"
					buttonFunction={batchDetails}
				>
					<Suspense fallback={<LazyLoading />}>
						<SetBatchForm
							subjects={subject}
							id={rowData._id}
							batchValues={values}
						/>
					</Suspense>
				</Popover>
			</div>
		</div>
	);
});
// Assigning displayName to the component
ActionComponent.displayName = "ActionComponent";

const ManageBatch: React.FC = () => {
	const dispatch = useDispatch();
	const { show } = useToast();

	const allStudents = useSelector(
		(state: RootState) => state.Students.allStudents
	);
	const studentData = useMemo(() => toArray(allStudents), [allStudents]);
	const [page, setPage] = useState<number>(0);
	const [isMore, setIsMore] = useState(true);

	const fetchData = useCallback(() => {
		axios
			.get(`api/students/get-all-students?page=${page}`)
			.then((response) => {
				const { data } = response.data;
				console.log("rerender", page);
				if (page === 0) {
					setPage(1);
				} else {
					setPage((prev) => prev + 1);
				}
				if (page === 0) {
					dispatch(setAllStudents(data));
				} else {
					dispatch(pushAllStudents(data));
				}
				if (data.length === 0) {
					setIsMore(false);
				}
			})
			.catch((err) => {
				console.error(err);
				show({
					detail:
						err.response?.data?.message ||
						err.message ||
						"Internal server error",
					type: "error",
					summary: "Error",
				});
			});
	}, [dispatch, show, page]);
	useEffect(() => {
		if (page === 0 && studentData.length === 0) {
			console.log("useEffect", page);
			fetchData();
		}
	}, []);

	return (
		<div className="w-full h-full rounded-lg sm:rounded-l-[20px] md:rounded-l-[44px] border border-slate-400/70 overflow-hidden">
			<Header title="SetBatches">
				<p className="underline opacity-50">
					No of data{":-"} {studentData.length}
				</p>
			</Header>
			<div
				className="w-full h-[calc(100%-3.5rem)] overflow-auto bg-[#1f2937] custom-scrollbar relative"
				id="scrollableDiv"
			>
				<InfiniteScroll
					dataLength={studentData.length}
					next={fetchData}
					hasMore={isMore}
					loader={<Loader />}
					className="w-full"
					scrollableTarget="scrollableDiv"
					endMessage={
						<p style={{ textAlign: "center" }}>
							<b>Khattam bro</b>
						</p>
					}
				>
					<Suspense fallback={<LazyLoading />}>
						<QueryTable
							columns={[
								{ header: "Student", field: "name" },
								{ header: "Admission No", field: "admissionNo" },
								{ header: "Subjects", field: "subjects" },
							]}
							values={studentData}
							Components={ActionComponent}
						/>
					</Suspense>
				</InfiniteScroll>
			</div>
		</div>
	);
};
ManageBatch.displayName = "ManageBatch";

export default ManageBatch;
