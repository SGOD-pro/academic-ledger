"use client";
import React, { memo, useCallback, useRef, useState } from "react";
import InputFields from "./ui/InputFields";
import { Calendar } from "primereact/calendar";
import Select from "./ui/Select";
import { useDispatch } from "react-redux";
import axios from "axios";
import useToast from "@/hooks/ToastHook";
import { ExamProps } from "@/interfaces";
import {
	InputNumber,
	InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import SelectBatch from "./ui/SelectBatch";
import {SelectInterface} from "@/interfaces"
function ExamForm() {
	const [values, setValues] = useState<ExamProps>({
		title: "",
		caption: "",
		date: null,
		mode: false,
		fullMarks: 0,
	});
	const [mode, setMode] = useState<{ code: boolean; name: string } | null>();
	const modeValues = [
		{ name: "Online", code: true },
		{ name: "Offline", code: false },
	];
	const { show } = useToast();
	const [disable, setDisable] = useState(false);

	const [subject, setSubject] = useState<SelectInterface|null>();
	const [batch, setBatch] = useState<SelectInterface|null>();
	const handelSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log(subject);
		const data = { ...values, batch:batch?.code };
		if (!batch?.code) {
			show({
				summary: "WARNING",
				type: "warn",
				detail: "Please select batch",
			});
			return;
		}
		if (!mode) {
			show({
				summary: "WARNING",
				type: "warn",
				detail: "Please select mode",
			});
			return;
		}
		data.mode = mode.code;
		if (!data.fullMarks) {
			show({
				summary: "WARNING",
				type: "warn",
				detail: "Please add marks",
			});
			return;
		}
		return;

		setDisable(true);
		axios
			.post(`/api/exam/set-exam`, data)
			.then((response) => {
				show({
					summary: "Added",
					type: "success",
					detail: response.data.message,
				});
				setValues({
					title: "",
					caption: "",
					date: null,
					mode: false,
					fullMarks: 0,
				});
			})
			.catch((err) => {
				show({
					summary: "Added",
					type: "error",
					detail: err.response.data.message || "Internal Error",
				});
			})
			.finally(() => {
				setDisable(false);
			});
	};

	return (
		<form
			className="w-full h-full overflow-auto space-y-1 md:space-y-3"
			onSubmit={handelSubmit}
		>
			<InputFields name={"title"} value={values.title} setValue={setValues} />
			<div className="flex flex-wrap w-full  ">
				<label htmlFor="caption" className="flex-grow flex-shrink basis-24">
					Caption
				</label>
				<textarea
					name="caption"
					id="caption"
					value={values.caption}
					className="flex-grow flex-shrink basis-44 rounded-md p-1 h-20 focus:outline outline-[3px] outline-teal-500/30 transition-all resize-none bg-[#393E46]"
					onChange={(e) => {
						setValues((prev) => ({ ...prev, caption: e.target.value }));
					}}
				></textarea>
			</div>
			<SelectBatch
				labels={["Subjects", "Batches"]}
				setBatchValue={setBatch}
				setSubjectValue={setSubject}
			/>
			<div className="flex flex-wrap w-full">
				<label htmlFor="" className="flex-grow flex-shrink basis-24">
					Mode
				</label>
				<div className="card flex justify-content-center flex-grow flex-shrink basis-44 rounded-md text-xs">
					<Select
						options={modeValues}
						handleChange={(e) => {
							setMode(e.value);
						}}
						value={mode}
						placeholder={"Select mode"}
					/>
				</div>
			</div>
			<div className="flex justify-between flex-wrap w-full">
				<label
					htmlFor="minmax"
					className="block mb-2 flex-grow flex-shrink basis-24"
				>
					Marks
				</label>
				<div className="card flex justify-content-center flex-grow flex-shrink basis-44 rounded-md text-xs">
					<InputNumber
						inputId="minmax"
						value={values?.fullMarks}
						onValueChange={(e: InputNumberValueChangeEvent) => {
							setValues((prev) => ({ ...prev, fullMarks: e.value ?? null }));
						}}
						min={0}
						max={100}
						className="w-full"
						inputClassName="w-full"
					/>
				</div>
			</div>
			<div className="flex flex-wrap w-full  ">
				<label htmlFor="date" className="flex-grow flex-shrink basis-24">
					Date
				</label>
				<div className="card flex justify-content-center flex-grow flex-shrink basis-44 rounded-md text-xs">
					<Calendar
						value={values.date}
						onChange={(e: any) =>
							setValues((prev) => ({ ...prev, date: e.value }))
						}
						style={{ width: "100%" }}
						dateFormat="dd/mm/yy"
						inputClassName="bg-[#393E46] p-2"
						id="date"
						name="date"
					/>
				</div>
			</div>
			<div className=" text-right">
				<button
					className="px-3 py-1 text-lg rounded-md bg-[#393E46]"
					disabled={disable}
				>
					Add
					{disable && <i className="pi pi-spin pi-spinner"></i>}
				</button>
			</div>
		</form>
	);
}

export default memo(ExamForm);
