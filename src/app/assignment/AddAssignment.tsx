import React, { useRef, useState, useCallback } from "react";
import SelectCom from "./SelectCom";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Nullable } from "primereact/ts-helpers";
import { pushAssignment } from "@/toolkit/slices";
import useToast from "@/hooks/ToastHook";
import { SelectInterface } from "@/interfaces";
function AddAssignment() {
	const [batch, setBatch] = useState<SelectInterface|null>();
	const [date, setDate] = useState<Nullable<Date>>();
	const { show } = useToast();
	const [loading, setloading] = useState(false);
	const [file, setFile] = useState<File | null>();

	const submit = useCallback(
		(e: React.FocusEvent<HTMLFormElement>) => {
			e.preventDefault();
			console.log(batch);

			if (!batch || batch.code) {
				show({
					summary: "Validation Error",
					type: "warn",
					detail: "Select Batch",
				});
				return;
			}
			setloading(true);

			axios
				.post(
					"/api/assignment",
					{
						fileUrl: file,
						batch: batch,
						submissionDate: date,
					},
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				)
				.then((response) => {
					pushAssignment(response.data.data);
					show({
						summary: "Added successfuly",
						type: "success",
						detail: response.data.message || "Assignment added",
					});
				})
				.catch((error) => {
					show({
						summary: "Error",
						type: "error",
						detail: error.response.data.message || "Internal server error",
					});
				})
				.finally(() => {
					setloading(false);
					setBatch({ name: "", code: "" });
					setDate(null);
				});
		},
		[batch, date]
	);

	return (
		<form
			action=""
			className="m-auto border w-full md:w-3/4 lg:w-1/2 p-3 mt-4 border-dashed rounded-lg overflow-x-auto"
			onSubmit={submit}
		>
			<div className="card flex justify-content-center mb-3">
				<FileUpload
					mode="basic"
					name="demo[]"
					accept="image/*"
					maxFileSize={1000000}
					onSelect={(e: FileUploadSelectEvent) => {
						setFile(e.files[0]);
					}}
				/>
			</div>
			<div className="flex gap-3 items-center justify-end flex-wrap sticky left-0">
				<SelectCom batchId={setBatch} setDate={setDate} />
				<button className="font-semibold border border-emerald-500 text-emerald-500 hover:bg-slate-200/10 rounded-xl shadow shadow-black basis-12">
					{!loading ? (
						<i className="pi pi-cloud-upload px-3 py-3"></i>
					) : (
						<i className="pi pi-spin pi-spinner px-3 py-3"></i>
					)}
				</button>
			</div>
		</form>
	);
}

export default AddAssignment;
