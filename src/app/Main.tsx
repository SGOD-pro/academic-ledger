"use client";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "@/components/Navbar";
import ToastComponent from "@/components/ui/ToastComponent";
import axios from "axios";
import { RootState } from "@/toolkit";
import { setSubject, setAllBatches } from "@/toolkit/slices";
import Offline from "@/components/ui/Offline";

const fetchSubjectsAndBatches = async (
	subjects: any[],
	batches: any[],
	dispatch: any
) => {
	try {
		const [subjectsResponse, batchesResponse] = await Promise.all([
			subjects.length === 0
				? axios.get("/api/subjects")
				: Promise.resolve({ data: {} }),
			batches.length === 0
				? axios.get("/api/batches/curd")
				: Promise.resolve({ data: {} }),
		]);

		if (subjectsResponse.data.allSubjects) {
			dispatch(setSubject(subjectsResponse.data.allSubjects));
		}

		if (batchesResponse.data.allBatches) {
			dispatch(setAllBatches(batchesResponse.data.allBatches));
		}
	} catch (error) {
		console.error(error);
	}
};

function Main({ children }: { children: React.ReactNode }) {
	const subjects = useSelector(
		(state: RootState) => state.Subjects.allSubjects
	);
	const batches = useSelector((state: RootState) => state.Batches.allBatches);
	const dispatch = useDispatch();

	const fetchData = useCallback(() => {
		fetchSubjectsAndBatches(subjects, batches, dispatch);
	}, [dispatch]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);
	const [isOnline, setIsOnline] = React.useState(true);
console.log(!isOnline);

	useEffect(() => {
		// if (typeof window !== "undefined") {
		// 	setIsOnline(navigator.onLine);

		// 	const handleOnline = () => setIsOnline(true);
		// 	// const handleOffline = () => setIsOnline(false);
		// 	const handleOffline = () => setIsOnline(true);

		// 	window.addEventListener("online", handleOnline);
		// 	window.addEventListener("offline", handleOffline);

		// 	return () => {
		// 		window.removeEventListener("online", handleOnline);
		// 		window.removeEventListener("offline", handleOffline);
		// 	};
		// }
	}, []);
	return (
		<>
			<main className="flex bg-[#00ADB5] max-w-screen h-screen overflow-x-hidden">
				{!isOnline ? (
					<div className="absolute left-0 top-0 w-full h-full z-[1000]">
						<Offline />
					</div>
				) : (
					<>
						<Navbar />
						<ToastComponent />
						<div className="w-full h-full shadow-left-side sm:rounded-l-3xl md:rounded-l-[4rem] sm:ml-2 p-2 md:p-5 bg-gradient-radial relative z-0 overflow-hidden max-w-screen">
							{children}
						</div>
					</>
				)}
			</main>
		</>
	);
}

export default Main
