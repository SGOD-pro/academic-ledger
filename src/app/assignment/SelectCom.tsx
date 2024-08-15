import React, { memo, useCallback, useState } from "react";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { SelectInterface } from "@/interfaces";
import SelectBatch from "@/components/ui/SelectBatch";
interface SelectCom {
	batchId: React.Dispatch<React.SetStateAction<SelectInterface | null>>;
	setDate: React.Dispatch<React.SetStateAction<Nullable<Date>>>;
}

const SelectCom = ({ batchId, setDate }: SelectCom) => {
	let today = new Date();
	let month = today.getMonth();
	let year = today.getFullYear();
	let nextMonth = month === 11 ? 0 : month + 2;

	const [date, setdate] = useState<Nullable<Date>>(null);

	let minDate = new Date();

	minDate.setMonth(month);
	minDate.setFullYear(year);

	let maxDate = new Date();

	maxDate.setMonth(nextMonth);
	maxDate.setFullYear(year);
	return (
		<>
			<SelectBatch setBatchValue={batchId} />
			<div className="card w-full lg:basis-44 lg:flex-shrink lg:flex-grow">
				<Calendar
					value={date}
					onChange={(e) => {	
						setdate(e.value);
						setDate(e.value);
					}}
					minDate={minDate}
					maxDate={maxDate}
					readOnlyInput
					placeholder="Submit date"
					className="w-full"
				/>
			</div>
		</>
	);
};

export default memo(SelectCom);
