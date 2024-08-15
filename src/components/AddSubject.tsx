"use client";
import React, { memo, useCallback, useState } from "react";
import InputFields from "./ui/InputFields";
import axios from "axios";
import { useDispatch } from "react-redux";
import { pushSubject } from "@/toolkit/slices";
import useToast from "@/hooks/ToastHook";

function AddSubject() {
	const { show } = useToast();
	const [subject, setSubject] = useState({
		subject: "",
	});
	console.log("rerendering add-subject");

	const dispatch = useDispatch();
	const [disable, setDisable] = useState(false);

	const handelSubmit = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			if (subject.subject === "") {
				return;
			}
			setDisable(true);
			axios
				.post("/api/subjects", subject)
				.then((response: any) => {
					console.log(response.data);
					setSubject({
						subject: "",
					});
					show({ summary: "Added", detail: "Subjet added.", type: "success" });
					dispatch(pushSubject(response.data.createdSub));
				})
				.catch((error) => {
					console.log(error);
					show({ summary: "Error", detail: error.message, type: "error" });
				})
				.finally(() => {
					setDisable(false);
				});
		},[]
	);

	return (
		<form className="w-full h-full space-y-2 sm:space-y-3" onSubmit={handelSubmit}>
			<InputFields
				name={"subject"}
				value={subject.subject}
				setValue={setSubject}
			/>

			<div className=" text-right">
				<button
					className={`px-3 py-1 text-lg rounded-md bg-[#393E46] ${
						disable && "grayscale-[50%] cursor-not-allowed"
					}`}
					disabled={disable}
				>
					Add
					{disable && <i className="pi pi-spin pi-spinner"></i>}
				</button>
			</div>
		</form>
	);
}

export default memo(AddSubject);
