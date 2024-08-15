"use client";

import Table from "@/components/ui/Table";
import Select from "@/components/ui/Select";
import axios from "axios";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { notFound } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";

function ShowAttendence({ params }: { params: { slug: string } }) {
	const [subjects, setSubjects] = useState();
	const [loading, setLoading] = useState<boolean>(true);
	const [showNav, setShowNav] = useState<boolean>(false);
	const [subjectsOptions, setSubjectsOptions] = useState<any[] | null>([]);
	const [byPresent, setByPesent] = useState<boolean>(true);
	const [data, setData] = useState<any[]>([]);
	const [stdData, setStdData] = useState<any>();
	const [error, setError] = useState(false);
	useEffect(() => {
		if (!params) {
			notFound();
		}
		const { slug } = params;
		setLoading(true);
		axios
			.get(`/api/attendence/get-student?id=${slug}`)
			.then((response) => {
				setStdData(response.data.data);
				setSubjectsOptions(response.data.data.subjects);
				setData(response.data.data.presents);
				setLoading(false);
			})
			.catch((error) => {
				console.log(error);

				setError(true);
			});
	}, []);
	useEffect(() => {
		if (error) {
			notFound();
		}
	}, [error]);

	return (
		<>
			<Loading loading={loading}>
				<header className=" flex justify-between items-center p-3 py-2">
					<h2 className="text-xl font-semibold capitalize">{stdData?.name}</h2>
					<i
						className="pi pi-bars sm:hidden active:scale-x-75 transition-all"
						onClick={() => {
							setShowNav((prev) => !prev);
						}}
					></i>
					<div
						className={`sm:visible flex sm:relative gap-4 items-center ${
							showNav ? "visible" : "invisible"
						} absolute bg-slate-900 sm:bg-transparent top-10 sm:top-0 right-0 mx-3 sm:mx-0 flex-col sm:flex-row z-30 w-[90vw] p-2 sm:p-0 rounded-md sm:w-fit`}
					>
						<Select
							value={subjects}
							handleChange={(e) => {
								setSubjects(e.value);
							}}
							options={subjectsOptions}
							placeholder="Select subject"
						/>
						<div className="flex items-center justify-between sm:justify-start w-full sm:w-64 gap-3">
							<label htmlFor="" className=" capitalize">
								by present
							</label>
							<InputSwitch
								checked={byPresent}
								onChange={(e: InputSwitchChangeEvent) => setByPesent(e.value)}
							/>
						</div>
					</div>
				</header>
				<div className=" overflow-x-auto">
					<Table
						columns={[
							{ header: "Subject", field: "subject" },
							{ header: "Date", field: "date" },
						]}
						values={data}
					/>
				</div>
			</Loading>
		</>
	);
}

export default ShowAttendence;
