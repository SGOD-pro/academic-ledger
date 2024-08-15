"use client";
import Header from "@/components/ui/Header";
import LazyLoading from "@/components/ui/LazyLoading";
const Loading = lazy(() => import("@/components/ui/Loading"));
import { Nullable } from "primereact/ts-helpers";
import useToast from "@/hooks/ToastHook";
import { RootState } from "@/toolkit";
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
import { AddAssignmentInterface, SelectInterface } from "@/interfaces";
import axios from "axios";
import Loader from "@/components/ui/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import Table from "@/components/ui/Table";
import SelectCom from "@/app/assignment/SelectCom";
import Link from "next/link";
const column = [
	{ header: "Subject", field: "subject" },
	{ header: "Issue", field: "issue" },
	{ header: "Submission", field: "submissionDate" },
];

function ShowAssignments() {
	const { show } = useToast();
	const assignments = useSelector(
		(state: RootState) => state.AssignmentExam.allAssignments
	);
	const [loading, setLoading] = useState<boolean>(false);
	const [batchId, setBatchId] = useState<SelectInterface | null>();
	const [date, setDate] = useState<Nullable<Date>>();
	const [values, setvalues] = useState<AddAssignmentInterface[]>([]);
	useEffect(() => {
		axios
			.get("/api/assignment")
			.then((response) => {
				setvalues(response.data.data);
				// dispatch(setAllAssignment(response.data.data));
			})
			.catch((error) => {
				show({
					type: "error",
					summary: "Error",
					detail: error.response?.data?.message || "An error occurred.",
				});
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const LinkTemplate = ({ data }: { data: AddAssignmentInterface }) => {
		const [loading, setLoading] = useState<boolean>(false);

		const handleDelete = async (id: string) => {
			try {
				setLoading(true);
				await axios.get("/api/assignment/delete?id=" + id);
				// dispatch(popAssignment(id));
				setLoading(false);
			} catch (error: any) {
				show({
					type: "error",
					summary: "Error",
					detail: error.response?.data?.message || "An error occurred.",
				});
			}
		};
		return (
			<div className="flex gap-2 items-center justify-center">
				{!data.fileURL ? (
					<Link href={`/assignment/${data._id}`}>
						<i className="pi pi-eye p-3 bg-teal-400 rounded-lg"></i>
					</Link>
				) : (
					<a href={`${data.fileURL}`} target="_blank">
						<i className="pi pi-eye p-3 bg-teal-400 rounded-lg"></i>
					</a>
				)}
				<button
					className="bg-gradient-to-tl to-red-400 from-red-600 rounded-lg p-3 grid place-items-center"
					onClick={() => {
						handleDelete(data._id);
					}}
					disabled={loading}
				>
					{loading ? (
						<i className="pi pi-spin pi-spinner"></i>
					) : (
						<i className="pi pi-trash"></i>
					)}
				</button>
			</div>
		);
	};
	return (
		<div className="w-full h-full rounded-lg sm:rounded-l-[20px] md:rounded-l-[44px] border border-slate-400/70 overflow-hidden">
			<Header title="Assignments">
				<div className="flex gap-2 h-fit items-start flex-col sm:flex-row">
					<SelectCom batchId={setBatchId} setDate={setDate} />
				</div>
				<button className="border rounded transition-all hover:rounded-tl-xl hover:rounded-br-2xl border-emerald-500 text-emerald-500 hover:bg-teal-300/20">
					<i className="pi pi-search p-3"></i>
				</button>
				<button className="border rounded transition-all hover:rounded-tl-xl hover:rounded-br-2xl border-cyan-500 text-cyan-500 hover:bg-cyan-300/20">
					<i className="pi pi-undo p-3"></i>
				</button>
			</Header>
			<main className="h-[calc(100%-3.5rem)] w-full relative">
				<Loading loading={loading}>
					<div className="card">
						<Table columns={column} values={[]} Components={LinkTemplate} />
					</div>
				</Loading>
			</main>
		</div>
	);
}

export default ShowAssignments;
