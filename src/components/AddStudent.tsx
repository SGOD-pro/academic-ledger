import React, { useEffect, useState, useCallback, useRef, memo } from "react";
import { MultiSelect } from "primereact/multiselect";
import InputFields from "./ui/InputFields";
import { useSelector, useDispatch } from "react-redux";
import useToast from "@/hooks/ToastHook";
import axios from "axios";
import { SelectInterface, StudentDetailsInterface } from "@/interfaces";
import {
	pushAllStudents,
	updateAllStudents,
	updateHomeStudents,
	pushHomeStudents,
	updateAdmissionNo,
} from "@/toolkit/slices";
import Select from "@/components/ui/Select";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import { Calendar } from "primereact/calendar";
import {RootState} from "@/toolkit"
function AddStudent({
	studentData,
	update,
	setUpdate,
	subject,
}: {
	studentData: StudentDetailsInterface;
	setUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
	update: boolean;
	subject: SelectInterface[] | null;
}) {
	const { show } = useToast();
	const admissionNo=useSelector((state:RootState)=>state.AdmissionNo.latestAdmissionNo)
	
	const [values, setValues] = useState<StudentDetailsInterface>({
		admissionNo: admissionNo,
		institutionName: "",
		picture: null,
		subjects: [],
		name: "",
		clg: false,
		stream: "",
		fees: 0,
		phoneNo: [],
		admissionDate: new Date(),
	});
	const [selectedSubjects, setSelectedSubjects] = useState<
		SelectInterface[] | null
	>(null);
	const [disable, setDisable] = useState(false);
	const [phoneNo, setPhoneNo] = useState<string[]>([]);
	const [phoneNoLen, setPhoneNoLen] = useState<number>(0);
	const [phoneNoText, setPhoneNoText] = useState("");
	const [studyIn, setStudyIn] = useState<SelectInterface | null>();
	useEffect(() => {
		if (update) {
			setSelectedSubjects(subject);
			setImageSrc(studentData.picture);
			setValues((prev) => ({ ...prev, picture: null }));
			const std = !studentData.clg
				? { name: "School", code: "School" }
				: { name: "Collage", code: "Collage" };
			setStudyIn(std);
			if (studentData.phoneNo && studentData.phoneNo[0]) {
				setPhoneNoLen(studentData.phoneNo.length === 2 ? 2 : 0);
				setPhoneNoText(studentData.phoneNo[0] || "");
				if (studentData.phoneNo.length === 2) {
					setPhoneNo(studentData.phoneNo);
				}
			}
		}
		setValues(studentData);
	}, [studentData]);

	const options = [
		{ name: "School", code: "School" },
		{ name: "Collage", code: "Collage" },
	];
	const setStudy = (e: any) => {
		setStudyIn(e.value);
		const v = e.value.name === "School" ? false : true;
		setValues((prev) => ({ ...prev, clg: v }));
	};

	const [imageSrc, setImageSrc] = useState<any>("");
	const fileInput = useRef<any>(null);
	const handleImage = () => {
		if (fileInput) {
			fileInput.current.click();
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const file = e.target.files?.[0];
		if (file) {
			setValues((prev) => ({
				...prev,
				picture: file,
			}));
			const reader = new FileReader();
			reader.onloadend = () => {
				setImageSrc(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const dispatch = useDispatch();

	useEffect(() => {
		if (selectedSubjects) {
			const subs = selectedSubjects.map((item: any) => item.name);
			setValues((prevValues: any) => ({
				...prevValues,
				subject: subs,
			}));
		}
	}, [selectedSubjects]);

	function validateForm() {
		if (!values.admissionNo.trim()) {
			show({
				summary: "Validation Error",
				type: "warn",
				detail: "Admission number is required.",
			});
			return false;
		}
		if (!values.admissionDate) {
			show({
				summary: "Validation Error",
				type: "warn",
				detail: "Admission Date is required.",
			});
			return false;
		}
		if (!values.name.trim()) {
			show({
				summary: "Validation Error",
				type: "warn",
				detail: "Name is required.",
			});
			return false;
		}
		const subjects = selectedSubjects?.map((subject) => subject.name);
		if (subjects) {
			setValues((prev) => ({ ...prev, subjects }));
		}
		if (!subjects || subjects?.length === 0) {
			show({
				summary: "Validation Error",
				type: "warn",
				detail: "At least one subject is required.",
			});
			return false;
		}
		if (!values.stream?.trim()) {
			show({
				summary: "Validation Error",
				type: "warn",
				detail: "Stream is required.",
			});
			return false;
		}
		if (!values.institutionName?.trim()) {
			show({
				summary: "Validation Error",
				type: "warn",
				detail: "Instituon name is required.",
			});
			return false;
		}
		const data = { ...values };
		if (phoneNo.length === 0 && phoneNoText.trim() !== "") {
			if (phoneNoText.trim().length < 10) {
				show({
					summary: "Insufficient",
					type: "info",
					detail: `Phone number must be 10 digits, given ${
						phoneNoText.trim().length
					}`,
				});
				return false;
			}
			data.phoneNo = [phoneNoText];
		} else {
			data.phoneNo = phoneNo;
		}
		if (data.phoneNo === null || data.phoneNo?.length === 0) {
			show({
				summary: "Validation Error",
				type: "warn",
				detail: "At least one phone number is required.",
			});
			return false;
		}

		return true;
	}

	function resetValues() {
		const data = {
			admissionNo: admissionNo,
			picture: null,
			subjects: [],
			name: "",
			clg: false,
			stream: "",
			fees: 0,
			institutionName: "",
			phoneNo: [],
			admissionDate: new Date(),
		};
		setValues(data);
		setPhoneNo([]);
		setPhoneNoText("");
		setPhoneNoLen(0);
		setStudyIn({ name: "School", code: "School" });
		setImageSrc(null);
		setSelectedSubjects(null);
		studentData = {
			admissionNo: admissionNo,
			picture: null,
			subjects: [],
			name: "",
			clg: false,
			stream: "",
			fees: 0,
			institutionName: "",
			phoneNo: [],
			admissionDate: new Date(),
		};
	}
	const AllSubjects = useSelector((state: any) => state.Subjects.allSubjects);
	const subjects = useCallback(
		AllSubjects?.map((subject: any) => ({
			name: subject.subject,
		})),
		[AllSubjects]
	);
	const [error, setError] = useState(false);
	useEffect(() => {
		if (error) {
			setError(false);
		}
	}, [values.admissionNo]);

	const handleSubmit = useCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			if (!validateForm()) {
				return;
			}
			const data = { ...values };
			if (phoneNo.length === 0 && phoneNoText.trim() !== "") {
				if (phoneNoText.length !== 10) {
					show({
						summary: "Insufficient",
						type: "info",
						detail: `Phone number must be 10 digits, given ${phoneNoText.length}`,
					});
					return;
				}
				data.phoneNo = [phoneNoText];
			} else {
				data.phoneNo = phoneNo;
			}
			setDisable(true);
			try {
				if (update) {
					const id = localStorage.getItem("_id");
					if (!id) {
						show({
							summary: "NOT FOUND",
							type: "info",
							detail: `Connot find the id`,
						});
						return;
					}
					const response = await axios.put(
						`/api/students/curd?id=${id}`,
						data,
						{
							headers: {
								"Content-Type": "multipart/form-data",
							},
						}
					);
					dispatch(updateAllStudents(response.data.data));
					dispatch(updateHomeStudents(response.data.data));
					setValues(prev=>({...prev,admissionNo}))
					show({
						summary: "Updated",
						type: "success",
						detail: response.data.message,
					});
				} else {
					const response = await axios.post(`/api/students/curd`, data, {
						headers: {
							"Content-Type": "multipart/form-data",
						},
					});
					resetValues();
					dispatch(pushAllStudents(response.data.data));
					dispatch(pushHomeStudents(response.data.data));
					dispatch(updateAdmissionNo(response.data.data.admissionNo));
					show({
						summary: "Added",
						type: "success",
						detail: response.data.message,
					});
				}
				setDisable(false);
			} catch (error: any) {
				console.log(error);
				show({
					summary: "Error",
					type: "error",
					detail: error.response?.data?.message || error.message,
				});
				setDisable(false);
			}
		},
		[values, phoneNoText, phoneNo, values.admissionNo]
	);

	const handleAddPhoneNo = () => {
		const trimmedPhoneNoText = phoneNoText.trim();
		if (trimmedPhoneNoText.length !== 10) {
			alert(
				`Phone number must be 10 digits, given ${trimmedPhoneNoText.length}`
			);
			return;
		}
		if (trimmedPhoneNoText !== "") {
			setPhoneNo((prev) => [...prev, trimmedPhoneNoText]);
			setPhoneNoLen((prev) => prev + 1);
			setPhoneNoText("");
		}
	};

	const handleRemovePhoneNo = () => {
		setPhoneNo([]);
		setPhoneNoText("");
		setPhoneNoLen(0);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPhoneNoText(e.target.value);
	};
	return (
		<form
			className={`w-full h-full grid gap-x-3 items-center 
				sm:grid-cols-2 grid-cols-1 text-left
			 `}
			onSubmit={handleSubmit}
		>
			<InputFields
				name={"admissionNo"}
				value={values.admissionNo}
				setValue={setValues}
			/>
			<div className="card items-center flex flex-wrap w-full my-1 md:my-2">
				<label htmlFor="" className="flex-grow flex-shrink basis-28">
					Admission Date
				</label>
				<div className="flex-grow flex-shrink basis-full sm:basis-44">
					<Calendar
						value={values.admissionDate}
						onChange={(e) =>
							setValues((prev) => ({ ...prev, admissionDate: e.value }))
						}
						className="w-full"
						dateFormat="dd/mm/yy"
						inputClassName="bg-[#393E46] p-2"
					/>
				</div>
			</div>

			<InputFields name={"name"} value={values.name} setValue={setValues} />
			<div className="flex flex-wrap items-center relative justify-start">
				<label htmlFor="" className="mr-14">
					Upload image
				</label>
				<input
					type="file"
					accept="image/*"
					className="invisible absolute"
					ref={fileInput}
					onChange={handleFileChange}
					id="image"
				/>
				<div
					className="w-16 h-16 ml-5 border rounded-full relative overflow-hidden grid place-content-center cursor-pointer"
					onClick={handleImage}
				>
					{imageSrc ? (
						<Image
							src={imageSrc}
							alt="not upl0ded"
							className="absolute w-[150%] h-[150%] object-cover object-top scale-150"
							id="profile-pic"
							width={100}
							height={100}
						/>
					) : (
						<Icon
							src={"https://cdn.lordicon.com/bgebyztw.json"}
							secondaryColor={"#EEEEEE"}
						/>
					)}
				</div>
			</div>

			<div className="card items-center flex flex-wrap w-full my-1 md:my-2">
				<label htmlFor="" className="flex-grow flex-shrink basis-28">
					Subjects
				</label>
				<div className="flex-grow flex-shrink basis-full sm:basis-44">
					<MultiSelect
						value={selectedSubjects}
						onChange={(e: any) => {
							setSelectedSubjects(e.value);
						}}
						options={subjects}
						optionLabel="name"
						placeholder="Select Subjects"
						maxSelectedLabels={3}
						className="text-sm bg-[#393E46] w-full"
					/>
				</div>
			</div>
			<div className="flex flex-wrap w-full my-1 md:my-2 items-center">
				<label htmlFor="" className="flex-grow flex-shrink basis-28">
					Select study in
				</label>
				<div className="flex-grow flex-shrink basis-full sm:basis-44">
					<Select
						value={studyIn}
						handleChange={setStudy}
						options={options}
						placeholder={"Select study in"}
					/>
				</div>
			</div>
			<InputFields
				name={"stream"}
				value={values.stream}
				setValue={setValues}
				lable={values.clg ? "stream" : "class"}
			/>
			<InputFields
				name={"institutionName"}
				value={values.institutionName}
				setValue={setValues}
				lable={values.clg ? "institutionName" : "SchoolName"}
			/>
			<div className="flex flex-wrap items-center w-full my-1 md:my-2">
				<label
					htmlFor="phone-no"
					className="flex-grow flex-shrink basis-full sm:basis-24 capitalize mr-2"
				>
					Contact
				</label>
				<div className="flex flex-grow flex-shrink basis-full sm:basis-44 rounded-md bg-[#393E46] transition-all items-center px-1 border border-transparent peer">
					{phoneNoLen > 0 && (
						<i
							className="pi pi-angle-left p-1 rounded-full bg-emerald-500 cursor-pointer"
							onClick={() => {
								if (phoneNoLen > 1) {
									setPhoneNoText(phoneNo[0]);
								}
							}}
						></i>
					)}
					<input
						type="text"
						value={phoneNoText}
						onChange={handleInputChange}
						className="flex-grow w-14 flex-shrink basis-full outline-none sm:basis-44 rounded-md px-1 py-2 bg-transparent peer"
						placeholder="Enter phone number"
						readOnly={phoneNoLen === 2}
						id="phone-no"
					/>
					{phoneNoLen < 2 ? (
						<i
							className="pi pi-plus p-1 rounded-full bg-emerald-500 cursor-pointer"
							onClick={handleAddPhoneNo}
						></i>
					) : (
						<i
							className="pi pi-eraser rounded-full p-1 mr-1 bg-orange-600 cursor-pointer"
							onClick={handleRemovePhoneNo}
						></i>
					)}
					{phoneNoLen === 2 && (
						<i
							className="pi pi-angle-right p-1 rounded-full bg-emerald-500 cursor-pointer"
							onClick={() => {
								setPhoneNoText(phoneNo[1]);
							}}
						></i>
					)}
				</div>
			</div>
			<InputFields
				name={"fees"}
				value={values.fees}
				setValue={setValues}
				type="number"
			/>
			<div className={`text-right sm:col-start-2`}>
				{update && setUpdate && (
					<button
						className={`px-3 py-1 text-lg rounded-md active:scale-90 transition-all shadow-md shadow-black active:shadow-none bg-gradient-to-l to-red-400 from-red-700 mr-3 disabled:bg-gray-800 disabled:opacity-75`}
						disabled={disable}
						onClick={() => {
							resetValues();
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
					className={`px-3 py-1 text-lg rounded-md bg-[#393E46] active:scale-90 transition-all shadow-md shadow-black active:shadow-none ${
						update && "bg-gradient-to-l to-emerald-400 from-emerald-700"
					} disabled:bg-gray-800 disabled:opacity-75`}
					disabled={disable}
				>
					{!update ? "Add" : <i className="pi pi-check"></i>}
					{disable && <i className="pi pi-spin pi-spinner ml-1"></i>}
				</button>
			</div>
		</form>
	);
}

export default memo(AddStudent);
