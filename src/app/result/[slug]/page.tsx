"use client";
import useToast from "@/hooks/ToastHook";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

interface StudentData {
	_id: string;
	name: string;
	admissionNo: string;
	picture?: string;
}
interface Value {
	subject: string;
	_id: string;
	date: string;
	marks: number;
	students: StudentData[];
}

function SetResult({ params }: { params: { slug: string } }) {
	const { slug } = params;
	const [error, setError] = React.useState(false);
	const [studentsMarks, setStudentsMarks] = React.useState<{
		[key: string]: number;
	}>({});
	const {show}=useToast();
	useEffect(() => {
		axios
			.get(`/api/result/students?id=${slug}`)
			.then((response) => {
				console.log(response.data);
				setValues(response.data.data);
				const s: any = {};
				response.data.data.students.map((item: StudentData) => {
					s[item._id] = 0;
				});
				if (response.data.exists) {
					setStudentsMarks(response.data.marks?.result);
				} else {
					setStudentsMarks(s);
				}
			})
			.catch((error) => {
				console.log(error);
				setError(true);
			});
	}, [slug]);
	useEffect(() => {
		if (error) {
			notFound();
		}
	}, [error]);

	const [values, setValues] = React.useState<Value>();
	const handleAddStudent = () => {
		console.log(studentsMarks);
		const data = [];
		for (const key in studentsMarks) {
			if (Object.prototype.hasOwnProperty.call(studentsMarks, key)) {
				if (values?.marks && studentsMarks[key] > values.marks) {
					show({
						summary: "Invalid Marks",
						detail: "Full marks is " + values.marks,
						type: "warn",
					});
					return;
				}
				data.push({ studentId: key, marks: studentsMarks[key] });
			}
		}
		console.log(data, values?._id);
		if (!values?._id) {
			return;
		}
		axios
			.post(`/api/result/set-marks?id=${values?._id}`, data)
			.then((response) => {
				console.log(response.data);
			})
			.catch((err) => {
				console.log(err);
				show({
					summary: "Invalid Marks",
					detail: err.response.data.message || "Internal error occurred",
					type: "error",
				});
			});
	};
	const handleInputChange = (id: string, value: number) => {
		setStudentsMarks((prev) => ({
			...prev,
			[id]: value,
		}));
	};
	return (
		<>
			<header className="flex items-center justify-between px-4 border-b border-slate-300/50 mb-3 h-14">
				<h2 className="text-3xl font-semibold">{values?.subject}</h2>
				<div className="flex gap-3 items-end">
					<Link
						className="border border-slate-500 text-slate-500 rounded-md hover:bg-slate-200/10"
						href={"/result"}
					>
						<i className="pi pi-arrow-left p-3"></i>
					</Link>
					<button
						className="border border-emerald-400 text-emerald-400 rounded-md hover:bg-slate-200/10"
						onClick={handleAddStudent}
					>
						<i className="pi pi-save p-3"></i>
					</button>

					<p className="hidden sm:block opacity-45 tracking-tight">
						Assign Date:- {values?.date}
					</p>
				</div>
			</header>
			<main className="max-h-[calc(100vh-6.5rem)] relative border rounded-3xl sm:p-4 p-2 overflow-auto custom-scrollbar">
				<div className="h-full overflow-auto">
					<table className="table-auto w-full">
						<thead className="font-semibold uppercase text-gray-400 text-lg">
							<tr>
								<th className="p-2 whitespace-nowrap">
									<div className="font-semibold text-left">Admission no</div>
								</th>
								<th className="p-2 whitespace-nowrap text-center">
									<div className="font-semibold text-left">Name</div>
								</th>
								<th className="p-2 whitespace-nowrap">
									<div className="font-semibold text-right">Set Marks</div>
								</th>
							</tr>
						</thead>
						<tbody className="text-sm divide-y divide-gray-100 relative">
							{values?.students?.map((item, index) => (
								<tr key={index} className="p-3 ">
									<td className="whitespace-nowrap p-3">
										<div className=" font-medium text-rose-400">
											{item.admissionNo}
										</div>
									</td>
									<td className="whitespace-nowrap p-3">
										<div className=" font-medium text-left">{item.name}</div>
									</td>
									<td className="whitespace-nowrap p-3">
										<div className="text-right my-2">
											<input
												type="number"
												placeholder={values?.marks + ""}
												id={item._id}
												className="bg-[#393E46] px-3 py-2 rounded-md outline-none focus:outline focus:outline-[#00ADB5]/60"
												max={values?.marks + ""}
												value={studentsMarks[item._id]}
												onChange={(e) =>
													handleInputChange(
														item._id,
														parseFloat(e.target.value)
													)
												}
											/>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</main>
		</>
	);
}

export default SetResult;
