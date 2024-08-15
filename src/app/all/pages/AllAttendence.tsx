"use client";
import Header from "@/components/ui/Header";
import LazyLoading from "@/components/ui/LazyLoading";
import Loading from "@/components/ui/Loading";
const Table = lazy(() => import("@/components/ui/Table"));
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
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "@/components/ui/Loader";
import Link from "next/link";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";

interface BatchesInterface {
	batchName: string;
	batchId: string;
	noOfPresents: string;
	originalId: string;
}
interface ShowAttendenceInterface {
	date: string;
	_id: string;
	batches: BatchesInterface[];
}
interface Studnets {
	_id: string;
	name: string;
	picture: string;
	presents: number;
}
function AllAttendence() {
	const { show } = useToast();
	const [date, setDate] = useState<Nullable<Date>>(null);
	const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);
	const inputElement = useRef<HTMLInputElement>(null);
	const reset = () => {
		setDate(null);
		setDates(null);
	};
	return (
		<main className="w-full h-full rounded-lg sm:rounded-l-[20px] md:rounded-l-[44px] border border-slate-400/70 overflow-hidden">
			<Header title="All Attendence">
				<div className="card flex justify-content-center w-full lg:w-32">
					<Calendar
						value={date}
						onChange={(e) => setDate(e.value)}
						placeholder="Spcific Date"
						className="w-full text-sm"
					/>
				</div>
				<div className="card flex justify-content-center  w-full lg:w-36">
					<Calendar
						value={dates}
						onChange={(e) => setDates(e.value)}
						selectionMode="range"
						readOnlyInput
						hideOnRangeSelection
						dateFormat="d/m/y"
						className="w-full text-sm"
						placeholder="B/W Range"
					/>
				</div>
				<div className="flex bg-[#393E46] px-3 rounded-md items-center py-2 ">
					<input
						type="text"
						ref={inputElement}
						className=" outline-none h-full bg-transparent cursor-help border-r border-slate-900/80 mr-2 lg:w-36 text-sm"
					/>
					<i className="pi pi-search cursor-pointer"></i>
				</div>
				<button
					className="border-cyan-500 text-cyan-500 border hover:text-[#0E1014] disabled:text-white transition-colors hover:bg-cyan-500 disabled:bg-gray-700 rounded-md flex items-center justify-center gap-1 sm:gap-0 p-2 px-3 font-semibold disabled:grayscale disabled:cursor-not-allowed disabled:shadow-none hover:shadow-lg hover:shadow-cyan-800/90 "
					onClick={reset}
					disabled={!date && !dates}
				>
					<i className="pi-filter-slash pi text-xs"></i>
				</button>
			</Header>
			<div className="h-[calc(100%-3.5rem)] w-full relative">
				<Suspense fallback={<LazyLoading />}>
					<Table columns={[]} values={[]} />
				</Suspense>
			</div>
		</main>
	);
}

export default AllAttendence;
