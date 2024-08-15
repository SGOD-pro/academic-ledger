"use client";
import React, { useEffect, useState, useCallback, memo } from "react";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import "./checkbox.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { pushBatches, updateBatches } from "@/toolkit/slices";
import useToast from "@/hooks/ToastHook";
import { Batch } from "@/interfaces";

function AddDaysTime({ data, update }: { data: Batch; update: boolean }) {
	const [values, setValues] = useState<Batch>({
		subject: null,
		startTime: null,
		endTime: null,
		days: [],
	});
	const [Update, setUpdate] = useState(false);

	useEffect(() => {
		setValues(data);
		setUpdate(update);
	}, [data]);

	const [disable, setDisable] = useState(false);
	const dispatch = useDispatch();
	const { show } = useToast();
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const AllSubjects = useSelector((state: any) => state.Subjects.allSubjects);
	const subjects = AllSubjects.map((subject: any) => ({
		name: subject.subject,
	}));

	function calcEndTime() {
		if (values.startTime) {
			const newDate = new Date(values.startTime);
			if (
				newDate.getHours() < 22 ||
				(newDate.getHours() === 22 && newDate.getMinutes() < 30)
			) {
				newDate.setMinutes(newDate.getMinutes() + 90);
			}
			return newDate;
		}
		return null;
	}
	const handleCheckboxChange = (event: any) => {
		const { value, checked } = event.target;
		let newVal = [];
		if (checked) {
			newVal = [...values.days, value];
		} else {
			newVal = values.days.filter((designation) => designation !== value);
		}
		setValues((prev) => ({ ...prev, days: newVal }));
	};
	
	const submit = useCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			try {
				if (Update) {
					const _id = localStorage.getItem("batch_id");
					if (!_id) {
						show({
							summary: "NOT FOUND",
							type: "info",
							detail: `Connot find the id`,
						});
						return;
					}
					setDisable(true);

					const response = await axios.put(
						`/api/batches/curd?_id=${_id}`,
						values
					);
					dispatch(updateBatches(response.data.data));
					show({
						type: "success",
						summary: "Updated",
						detail: response.data.message,
					});
				} else {
					setDisable(true);
					const response = await axios.post(`/api/batches/curd`, values);
					dispatch(pushBatches(response.data.data));
					show({
						type: "success",
						summary: "Added",
						detail: response.data.message,
					});
				}
				setValues({
					subject: null,
					startTime: null,
					endTime: null,
					days: [],
				});
				setDisable(false);
				localStorage.clear();
				setUpdate(false);
				update = false;
			} catch (error: any) {
				console.log(error);
				show({
					type: error.response.status > 400 ? "error" : "warn",
					summary: error.response.status > 400 ? "Error" : "Warning",
					detail: error.response.data.message || "Internal Server Error",
				});
				setValues({
					subject: null,
					startTime: null,
					endTime: null,
					days: [],
				});
				setDisable(false);
				localStorage.clear();
				setUpdate(false);
				update = false;
			}
		},
		[values, Update]
	);

	const [dummy, setDummy] = useState<boolean>(update);
	useEffect(() => {
		if (dummy) {
			return;
		}
		const val = calcEndTime();
		setValues((prev: any) => ({ ...prev, endTime: val }));
	}, [values.startTime]);
	const handleStartTimeChange = useCallback((e: any) => {
		const newStartTime = e.value;
		setValues((prev: Batch) => {
			const newEndTime = calculateEndTime(newStartTime);
			return {
				...prev,
				startTime: newStartTime,
				endTime: newEndTime,
			};
		});
	}, []);

	const calculateEndTime = (startTime: Date | null): Date | null => {
		if (!startTime) return null;
		const endTime = new Date(startTime);
		endTime.setHours(endTime.getHours() + 1);
		return endTime;
	};

	const handleEndTimeChange = useCallback((e: any) => {
		setValues((prev: Batch) => ({ ...prev, endTime: e.value }));
	}, []);
	return (
		<form action="" className=" space-y-2 sm:space-y-3" onSubmit={submit}>
			<div className="flex flex-wrap">
				<label htmlFor="caption" className="flex-grow flex-shrink basis-10">
					Subject
				</label>
				<div className="card flex justify-content-center flex-grow flex-shrink basis-44 rounded-md text-xs">
					<Dropdown
						value={values.subject}
						onChange={(e) => {
							setValues((prev) => ({ ...prev, subject: e.value }));
						}}
						options={subjects}
						optionLabel="name"
						placeholder="Select a Subject"
						className="w-full md:w-14rem text-xs bg-[#393E46]"
					/>
				</div>
			</div>

			<div className="flex flex-wrap">
				<label htmlFor="caption" className="flex-grow flex-shrink basis-10">
					Start Time
				</label>
				<div className="card flex justify-content-center flex-grow flex-shrink basis-44 rounded-md text-xs w-full">
					<Calendar
						value={values.startTime}
						onChange={handleStartTimeChange}
						timeOnly
						placeholder="<22:30"
						style={{ width: "100%" }}
					/>
				</div>
			</div>
			<div className="flex flex-wrap">
				<label htmlFor="caption" className="flex-grow flex-shrink basis-10">
					End Time
				</label>
				<div className="card flex justify-content-center flex-grow flex-shrink basis-44 rounded-md text-xs w-full">
					<Calendar
						value={values.endTime}
						onChange={handleEndTimeChange}
						timeOnly
						placeholder="24hours format"
						style={{ width: "100%" }}
					/>
				</div>
			</div>

			<div className="grp flex gap-4 items-center">
				<div className="days flex items-center gap-2 w-full justify-between">
					{days.map((item, index) => (
						<div className="content" key={index}>
							<label className="checkBox relative">
								<input
									name={item.trim()}
									id={item.trim()}
									type="checkbox"
									value={item.trim()}
									checked={values.days.includes(item.trim())}
									onChange={handleCheckboxChange}
								/>
								<label
									htmlFor={item}
									className=" uppercase absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-semibold font-mono pointer-events-none bg-transparent z-20 text-[#00ADB5]"
								>
									{item[0]}
								</label>
								<div className="transition z-0"></div>
							</label>
						</div>
					))}
				</div>
			</div>
			<div className=" text-right mt-5">
				{Update && (
					<button
						className={`px-3 py-1 text-lg rounded-md bg-gradient-to-l to-red-400 from-red-700 mr-3`}
						disabled={disable}
						onClick={(e) => {
							e.preventDefault();
							setValues({
								subject: null,
								startTime: null,
								endTime: null,
								days: [],
							});
							localStorage.clear();
							setUpdate(false);
						}}
					>
						{disable ? (
							<i className="pi pi-spin pi-spinner ml-1"></i>
						) : (
							<i className="pi pi-times"></i>
						)}
					</button>
				)}
				<button
					className={`px-3 py-1 text-lg rounded-md bg-[#393E46] ${
						Update && " bg-gradient-to-l to-emerald-400 from-emerald-700"
					}`}
					disabled={disable}
				>
					{!Update ? "Add" : <i className="pi pi-check"></i>}
					{disable && <i className="pi pi-spin pi-spinner ml-1"></i>}
				</button>
			</div>
		</form>
	);
}

export default memo(AddDaysTime);
