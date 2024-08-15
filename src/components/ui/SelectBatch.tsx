import React, { memo, useState, useMemo, useEffect } from "react";
import {
	SelectInterface,
	EditFunction,
	NormalEditFunction,
} from "@/interfaces";
import Select from "./Select";
import { DropdownChangeEvent } from "primereact/dropdown";
import GetBatch from "./GetBatch";
import { useSelector } from "react-redux";
import { RootState } from "@/toolkit";

interface BatchSelectInterface {
	labels?: string[];
	setSubjectValue?: React.Dispatch<
		React.SetStateAction<SelectInterface | null>
	>;
	setBatchValue?: React.Dispatch<React.SetStateAction<SelectInterface | null>>;
	batchValue?: SelectInterface | null;
	subjectValue?: SelectInterface | null;
	batchChangeFunction?: EditFunction;
	buttonFunction?: NormalEditFunction;
}

function SelectBatch({
	labels,
	setSubjectValue,
	setBatchValue,
	batchValue,
	subjectValue,
	batchChangeFunction,
	buttonFunction,
}: BatchSelectInterface) {
	const AllSubjects = useSelector(
		(state: RootState) => state.Subjects.allSubjects
	);
	const subjects = useMemo(() => {
		return AllSubjects.map((subject: any) => ({
			name: subject.subject,
			code: subject._id,
		}));
	}, [AllSubjects]);
	const [selectedSubject, setSelectedSubject] =
		useState<SelectInterface | null>();

	const setSubject = (e: DropdownChangeEvent) => {
		const selectedSubject = e.value;
		setSelectedSubject(selectedSubject);
		if (setSubjectValue) {
			setSubjectValue(selectedSubject);
		}
		if (setBatchValue) {
			setBatchValue(null);
		}
	};
	useEffect(() => {
		if (subjectValue) {
			setSelectedSubject(subjectValue);
		}
	}, [subjectValue, batchValue]);

	return (
		<>
			<div className="flex flex-wrap w-full h-fit lg:basis-44 lg:flex-grow lg:flex-shrink">
				{labels && labels[0] && (
					<label className="flex-grow flex-shrink basis-24">{labels[0]}</label>
				)}
				<div className="flex justify-content-center flex-grow flex-shrink lg:basis-44 rounded-md text-xs">
					<Select
						options={subjects}
						handleChange={setSubject}
						value={selectedSubject}
						placeholder={"Subject"}
					/>
				</div>
			</div>
			{setBatchValue && (
				<GetBatch
					subject={selectedSubject?.name || ""}
					setBatchValue={setBatchValue}
					label={labels && labels[1]}
					batchValue={batchValue}
					batchChangeFunction={batchChangeFunction}
				/>
			)}
			{buttonFunction && (
				<button
					className="border-cyan-500 text-cyan-500 border hover:text-[#0E1014] disabled:text-white transition-colors hover:bg-cyan-500 disabled:bg-gray-700 rounded-md flex items-center justify-center gap-1 sm:gap-0 p-2 px-3 font-semibold disabled:grayscale disabled:cursor-not-allowed disabled:shadow-none hover:shadow-lg hover:shadow-cyan-800/90"
					onClick={()=>{buttonFunction();setSelectedSubject(null);}}
					disabled={selectedSubject ? false : true}
				>
					Clear <i className="pi-filter-slash pi"></i>
				</button>
			)}
		</>
	);
}

export default memo(SelectBatch);
