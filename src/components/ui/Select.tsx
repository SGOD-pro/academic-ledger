"use client";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
interface SelectProps {
	value: any;
	options: any;
	handleChange: (e: DropdownChangeEvent) => void;
	placeholder?: string;
	id?: string | undefined;
}

function Select({
	value,
	handleChange,
	options,
	placeholder,
	id = "",
}: SelectProps) {
	return (
		<Dropdown
			value={value}
			onChange={handleChange}
			options={options}
			optionLabel="name"
			placeholder={`${placeholder}`}
			className="w-full h-fit bg-[#393E46] p-0 text-xs text-left"
			id={id}
		/>
	);
}

export default Select;
