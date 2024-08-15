"use client";
import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { SelectInterface } from "@/interfaces";
import { pushAssignment } from "@/toolkit/slices";
import useToast from "@/hooks/ToastHook";
import { Nullable } from "primereact/ts-helpers";
import SelectCom from "@/app/assignment/SelectCom";
export default function App() {
	const editorRef = useRef<any>(null);
	const { show } = useToast();
	const [loading, setloading] = useState(false);
	const [batch, setBatch] = useState<SelectInterface | null>();
	const [date, setDate] = useState<Nullable<Date>>();

	const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!editorRef.current || batch || date) {
			show({
				summary: "Validation Error",
				type: "warn",
				detail: "Cannot get proper crediantial details",
			});
			return;
		}
		console.log(editorRef.current.getContent(), batch);
		setloading(true);

		axios
			.post(
				"/api/assignment",
				{
					explanation: editorRef.current.getContent(),
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
			});
	};
	return (
		<>
			<form
				action=""
				className="w-full h-[97%] flex flex-col"
				onSubmit={submitForm}
			>
				<Editor
					apiKey={process.env.NEXT_PUBLIC_EDITOR_KEY}
					onInit={(evt: any, editor: any) => (editorRef.current = editor)}
					// initialValue="<p>This is the initial content of the editor.</p>"

					init={{
						height: "90%",
						menubar: true,
						plugins: [
							"advlist",
							"autolink",
							"lists",
							"link",
							"image",
							"charmap",
							"print",
							"preview",
							"anchor",
							"searchreplace",
							"visualblocks",
							"code",
							"fullscreen",
							"insertdatetime",
							"media",
							"table",
							"paste",
							"help",
							"wordcount ",
						],
						toolbar:
							"undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent removeformat | help",
						content_style: `
            body, html, .mce-content-body {
              font-family: Helvetica, Arial, sans-serif;
              font-size: 14px;
              border-radius: 8rem;
              background-color: black;
              color: white;
              outline: none;
            }
          `,
						placeholder: "Write here...",
						skin: "oxide-dark",
						content_css: "dark",
					}}
				/>
				<div className="flex gap-1 sm:gap-3 items-end mt-2 mr-3 pl-4 md:pl-8 flex-wrap w-full sm:max-w-[50vw]">
					<SelectCom batchId={setBatch} setDate={setDate} />
					<button className="font-semibold border border-emerald-500 text-emerald-500 hover:bg-slate-200/10 rounded-lg shadow shadow-black">
						{!loading ? (
							<i className="pi pi-cloud-upload p-3"></i>
						) : (
							<i className="pi pi-spin pi-spinner p-3"></i>
						)}
					</button>
				</div>
			</form>
		</>
	);
}
