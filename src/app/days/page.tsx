"use client";
import React, {
	useEffect,
	useState,
	lazy,
	Suspense,
	useRef,
	useCallback,
} from "react";
const AddSubject = lazy(() => import("@/components/AddSubject"));
const AddDaysTime = lazy(() => import("./AddDaysTime"));
const Table = lazy(() => import("@/components/ui/Table"));
import { useDispatch, useSelector } from "react-redux";
import { popBatches } from "@/toolkit/slices";
import axios from "axios";
import useToast from "@/hooks/ToastHook";
import { DeleteFunction, Batch } from "@/interfaces";
import { RootState } from "@/toolkit";
import LazyLoading from "@/components/ui/LazyLoading";
import { BatchInterface } from "@/interfaces";
interface ActionComponentProps {
	rowData: BatchInterface;
}
const columns = [
	{ field: "subject", header: "Subject" },
	{ field: "time", header: "Time" },
	{ field: "days", header: "Days" },
];
function Days() {
	const dispatch = useDispatch();
	const { show } = useToast();
	const [values, setValue] = useState<Batch>({
		subject: null,
		startTime: null,
		endTime: null,
		days: [],
	});

	const convertTimeStringToDate = useCallback((timeString: string) => {
		const currentDate = new Date();
		const [hours, minutes] = timeString.split(":").map(Number);
		currentDate.setHours(hours, minutes);
		return currentDate;
	}, []);

	const update = useRef(false);

	const batches = useSelector((state: RootState) => state.Batches.allBatches);

	useEffect(() => {
		localStorage.clear();
	}, []);
	const ActionComponent: React.FC<ActionComponentProps> = ({ rowData }) => {
		const [loading, setLoading] = useState(false);
		const id = rowData._id;
	
		const editFunction = useCallback(() => {
			localStorage.setItem("batch_id", id);
			update.current = true;
			setValue({
				subject: { name: rowData.subject },
				startTime: convertTimeStringToDate(rowData.time.split("-")[0].trim()),
				endTime: convertTimeStringToDate(rowData.time.split("-")[1].trim()),
				days: rowData.days
					? rowData.days.includes(",")
						? rowData.days.split(",").map((item: string) => item.trim())
						: [rowData.days.trim()]
					: [],
			});
			console.log(convertTimeStringToDate(rowData.time.split("-")[1].trim()));
		}, [id, rowData]);
	
		const deleteFunction = useCallback(async () => {
			if (!id) return;
	
			setLoading(true);
			try {
				const response = await axios.delete(`/api/batches/curd?id=${id}`);
				if (response) {
					dispatch(popBatches(id));
					show({
						summary: "Deleted",
						detail: "Successfully deleted",
						type: "success",
					});
				}
			} catch (error) {
				console.error("Error occurred while deleting:", error);
				show({
					summary: "Not Deleted",
					detail: "Error occurred while deleting",
					type: "warn",
				});
			} finally {
				setLoading(false);
			}
		}, [id, dispatch, show]);
	
		return (
			<div className="flex gap-1">
				<button
					className="bg-gradient-to-tl to-red-400 from-red-600 shadow-rose-800/90 shadow-lg hover:shadow-none hover:scale-95 transition-all rounded-r-sm rounded-l-xl p-3 grid place-items-center"
					onClick={deleteFunction}
					disabled={loading}
				>
					{loading ? (
						<i className="pi pi-spin pi-spinner"></i>
					) : (
						<i className="pi pi-trash"></i>
					)}
				</button>
				<button
					className="bg-gradient-to-tl to-emerald-400 from-emerald-800 shadow-emerald-800/90 shadow-lg hover:shadow-none hover:scale-95 transition-all rounded-l-sm rounded-r-xl p-3 grid place-items-center"
					onClick={editFunction}
					disabled={loading}
				>
					<i className="pi pi-pen-to-square"></i>
				</button>
			</div>
		);
	};
	
	return (
		<main className="w-full h-full grid lg:grid-cols-[.8fr,1.2fr] gap-2 sm:gap-3">
			<section className="">
				<div className="rounded-md md:rounded-lg border border-[#EEEEEE]/60 md:rounded-tl-[2.5rem] sm:rounded-tl-2xl  overflow-hidden relative p-3 space-y-3">
					<h2 className="text-2xl capitalize font-semibold pl-4">
						New Subject
					</h2>
					<Suspense fallback={<LazyLoading />}>
						<AddSubject />
					</Suspense>
				</div>
				<div className="rounded-md md:rounded-lg border border-[#EEEEEE]/60 mt-2 md:mt-4 overflow-hidden relative p-3">
					<h2 className="text-2xl my-1 capitalize font-semibold">
						Set Days & Time
					</h2>
					<Suspense fallback={<LazyLoading />}>
						<AddDaysTime data={values} update={update.current} />
					</Suspense>
				</div>
			</section>
			<section className="md:rounded-bl-[2.5rem] lg:ronded-bl-lg rounded-md lg:rounded-lg overflow-hidden">
				<div className="w-full h-full relative overflow-auto custom-scrollbar bg-[#1F2937]">
					<h2 className="text-xl capitalize p-2 font-semibold sticky top-0 z-10 bg-[#393E46]">
						All Batches
					</h2>
					<Suspense fallback={<LazyLoading />}>
						<Table
							columns={columns}
							values={
								Array.isArray(batches) && batches[0]?._id.trim() !== ""
									? batches
									: []
							}
							Components={ActionComponent}
						/>
					</Suspense>
				</div>
			</section>
		</main>
	);
}

export default Days;
