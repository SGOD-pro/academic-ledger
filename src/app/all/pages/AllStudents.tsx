"use client";
import Header from "@/components/ui/Header";
import LazyLoading from "@/components/ui/LazyLoading";
const Loading = lazy(() => import("@/components/ui/Loading"));
import QueryTable from "@/components/ui/QueryTable";
const SelectBatch = lazy(() => import("@/components/ui/SelectBatch"));
import useToast from "@/hooks/ToastHook";

import React, {
	useState,
	useEffect,
	useCallback,
	lazy,
	Suspense,
	memo,
	useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { SelectInterface, StudentDetailsInterface } from "@/interfaces";
import axios from "axios";
import { popAllStudents, setAllStudents } from "@/toolkit/slices";
import Loader from "@/components/ui/Loader";
import InfiniteScroll from "react-infinite-scroll-component";

interface ActionComponentProps {
	rowData: StudentDetailsInterface;
}
const columns = [
	{ header: "Name", field: "name" },
	{ header: "Admission No", field: "admissionNo" },
	{ header: "Subjects", field: "subjects" },
];
const ActionComponent: React.FC<ActionComponentProps> = memo(({ rowData }) => {
	const [laoding, setLoading] = useState<boolean>(false);

	const deleteRecord = useCallback(() => {
		const id = rowData._id;
		if (id) {
			return;
		}
		setLoading(true);
		axios
			.get(`/api/student/deleteStudent?id=${id}`)
			.then((response) => {
				//TODO: check the deleteStudnet is it returning the deleted student id or not..
				popAllStudents(response?.data?.data);
			})
			.catch((error) => {
				setLoading(false);
			});
	}, []);

	return (
		<div>
			<div className="flex justify-end">
				<button
					className=" rounded-tl-xl rounded- shadow-xl active:shadow-none shadow-rose-800/80 active:scale-95 transition-all text-rose-500 border-rose-500"
					//onClick={deleteRecord}
				>
					<i className="pi pi-trash p-2 sm:p-3"></i>
				</button>
			</div>
		</div>
	);
});
ActionComponent.displayName = "ActionComponent";
function AllStudents() {
	const [subject, setSubject] = React.useState<SelectInterface | null>();
	const [loading, setLoading] = useState<boolean>(false);
	const { show } = useToast();
	const hasMore = useRef(false);
	const [studentData, setStudentData] = useState<StudentDetailsInterface[]>([]);
	const [searchResult, setSearchResult] = useState<
		StudentDetailsInterface[] | null
	>([]);
	const dispatch = useDispatch();
	const inputElement = useRef<HTMLInputElement>(null);
	const fetchData = () => {
		if (studentData.length === 0) {
			setLoading(true);
		}
		axios
			.get(``)
			.then((response) => {
				console.log(response.data.data);
				setStudentData([...studentData, ...response.data.data]);
				hasMore.current = response.data.data.length !== 0;
			})
			.catch((error) => {
				show({
					summary: "Cannot fetch",
					detail: error?.response?.data?.message || error.message,
					type: "error",
				});
			})
			.finally(() => {
				setLoading(false);
			});
	};
	const reset = useCallback(() => {
		() => {
			setSubject(null);
			setSearchResult(null);
			if (inputElement.current) {
				inputElement.current.value = "";
			}
		};
	}, []);

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<main className="w-full h-full rounded-lg sm:rounded-l-[20px] md:rounded-l-[44px] border border-slate-400/70 overflow-hidden">
			<Header title="All Students">
				<div className="flex bg-[#393E46] px-3 rounded-md items-center py-2">
					<input
						type="text"
						ref={inputElement}
						className=" outline-none h-full bg-transparent cursor-help border-r border-slate-900/80 mr-2"
					/>
					<i className="pi pi-search cursor-pointer"></i>
				</div>
				<Suspense fallback={<LazyLoading />}>
					<SelectBatch
						setSubjectValue={setSubject}
						subjectValue={subject}
						buttonFunction={reset}
					/>
				</Suspense>
			</Header>
			<div className="h-[calc(100%-3.5rem)] w-full relative">
				<Loading loading={loading}>
					<div
						className="w-full h-full custom-scrollbar overflow-auto"
						id="scrollableDiv"
					>
						<InfiniteScroll
							dataLength={studentData.length}
							next={fetchData}
							hasMore={hasMore.current}
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
									columns={columns}
									values={searchResult || studentData}
									Components={ActionComponent}
								/>
							</Suspense>
						</InfiniteScroll>
					</div>
				</Loading>
			</div>
		</main>
	);
}

export default AllStudents;
