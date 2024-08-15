"use client";
import React, { useEffect, useState, useCallback } from "react";
import Popover from "@/components/ui/Popover";
import ExamForm from "@/components/ExamForm";
import Table from "@/components/ui/Table";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAllExam } from "@/toolkit/slices";
import { RootState } from "@/toolkit";
import Link from "next/link";
import useToast from "@/hooks/ToastHook";
import Loading from "@/components/ui/Loading";

const column = [
	{ header: "Subject", field: "subject" },
	{ header: "Time&Date", field: "subject" },
];
function Result() {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const { show } = useToast();
	const allExams = useSelector(
		(state: RootState) => state.AssignmentExam.allExams
	);
	useEffect(() => {
		if (Array.isArray(allExams) && allExams.length > 0) {
			return;
		}
		setLoading(true);
		axios
			.get("/api/result/set-exam")
			.then((response) => {
				console.log(response.data.data);
				dispatch(setAllExam(response.data.data));
			})
			.catch((error) => {
				console.log(error);
				show({
					summary: "Error",
					detail:
						error.message ||
						error.response.data.message ||
						"Internal Server Error",
					type: "error",
				});
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);
	return (
		<div className="w-full h-full rounded-lg sm:rounded-l-[20px] md:rounded-l-[44px] border border-slate-400/70 overflow-hidden">
			<header className="flex items-center justify-between border-b border-slate-400/60 px-6 h-14 z-10 relative">
				<h2 className="text-2xl sm:text-3xl font-semibold my-auto">
					Result{"/"}Exam
				</h2>
				<Popover
					icon={
						<i className="pi pi-plus-circle p-3 hover:bg-slate-400/20 pointer-events-none"></i>
					}
					buttonClassName="border-2 text-teal-500 border-teal-500 rounded-md"
				>
					<h3 className="text-xl font-semibold">Exam form</h3>
					<ExamForm />
				</Popover>
			</header>
			<main
				className="w-full h-[calc(100%-3.5rem)] overflow-auto bg-[#1f2937] custom-scrollbar relative"
				id="scrollableDiv"
			>
				<Loading loading={loading}>
					<Table columns={[]} values={[]}></Table>
				</Loading>
			</main>
		</div>
	);
}

export default Result;
