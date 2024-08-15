import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import useToast from "@/hooks/ToastHook";
import { SelectInterface, EditFunction } from "@/interfaces";
import GetBatch from "./ui/GetBatch";
import Loading from "./ui/Loading";
import { Batches } from "@/app/manageBatch/page";
interface BatchChangeValue {
	value: string;
	subject: string;
}
function MyForm({
	subjects,
	id,
	batchValues,
}: {
	subjects: SelectInterface[];
	id?: string;
	batchValues?: Batches;
}) {
	const [batch, setBatch] = useState<SelectInterface | null>(null);
	const [loading, setLoading] = useState(true);
	const batchesArr = useRef<BatchChangeValue[]>([]);
	useEffect(() => {
		setLoading(false);
	}, []);

	const batchChange = useCallback((value: BatchChangeValue) => {
		console.log("batchChange called with:", value);
		if (value) {
			console.log("Current batchesArr:", batchesArr.current);
			const index = batchesArr.current.findIndex(
				(item) => item.subject === value.subject
			);

			if (index !== -1) {
				console.log("Updating existing item:", batchesArr.current[index]);
				batchesArr.current[index] = value;
			} else {
				console.log("Adding new item:", value);
				batchesArr.current.push(value);
			}
		}
	}, []);
	const { show } = useToast();
	const [disabled, setDisabled] = useState(false);
	const submitEvent = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (!id) return;
			const val: string[] = [];
			batchesArr.current.forEach((element) => {
				if (element.value) {
					val.push(element.value);
				}
			});
			if (
				val.length === 0
			) {
				for (const key in batchValues) {
					if (Object.prototype.hasOwnProperty.call(batchValues, key)) {
						const element = batchValues[key];
						val.push(element.code);
					}
				}
			}
			const batches=Array.from(new Set(val))
			console.log(batches);
			setDisabled(true);
			axios
				.post(`/api/students/assign-batches?id=${id}`, { batches: batches })
				.then((response) => {
					show({
						type: "success",
						summary: "Success",
						detail: response.data.message,
					});
					localStorage.clear();
				})
				.catch((error) => {
					show({
						type: "error",
						summary: "Error",
						detail: error.response?.data?.message || error.message,
					});
				})
				.finally(() => {
					setDisabled(false);
				});
		},
		[id, show, batchesArr,batchValues]
	);

	return (
		<>
			<Loading loading={loading}>
				<form action="" onSubmit={submitEvent}>
					<div className="p-grid p-fluid space-y-2">
						{subjects.map((subject, index) => (
							<div className="grow shrink basis-44" key={index}>
								<GetBatch
									subject={subject.name}
									setBatchValue={setBatch}
									label={subject.name}
									batchValue={
										(batchValues && batchValues[subject.name]) || null
									}
									batchChangeFunction={batchChange}
								/>
							</div>
						))}
						<button className="border rounded-md text-teal-500 border-teal-600 hover:bg-teal-400/20">
							{disabled ? (
								<i className="pi pi-spin pi-spinner p-3"></i>
							) : (
								<i className="pi-save pi p-3"></i>
							)}
						</button>
					</div>
				</form>
			</Loading>
		</>
	);
}

export default memo(MyForm);
