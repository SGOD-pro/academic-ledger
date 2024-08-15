import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {StudentDetailsInterface} from "@/interfaces"
interface StudentData {
	admissionNo: string | null;
	name: string;
	subjects: string;
	_id: string;
	profilePicture: string;
}

const initialState = {
	homeStudents: {} as Record<string, StudentData>,
	allStudents: {} as Record<string, StudentData>,
};

export const studentSlice = createSlice({
	name: "Student",
	initialState,
	reducers: {
		// Home Students
		setHomeStudents: (state, action: PayloadAction<StudentData[]>) => {
			state.homeStudents = action.payload.reduce((acc, student) => {
				acc[student._id] = student;
				return acc;
			}, {} as Record<string, StudentData>);
		},
		pushHomeStudents: (state, action: PayloadAction<StudentData>) => {
			state.homeStudents[action.payload._id] = action.payload;
		},
		popHomeStudents: (state, action: PayloadAction<string>) => {
			delete state.homeStudents[action.payload];
		},
		updateHomeStudents: (state, action: PayloadAction<StudentData>) => {
			state.homeStudents[action.payload._id] = action.payload;
		},

		// All Students
		setAllStudents: (state, action: PayloadAction<StudentData[]>) => {
			state.allStudents = action.payload.reduce((acc, student) => {
				acc[student._id] = student;
				return acc;
			}, {} as Record<string, StudentData>);
		},
		pushAllStudents: {
			reducer: (state, action: PayloadAction<StudentData | StudentData[]>) => {
				if (Array.isArray(action.payload)) {
					action.payload.forEach((student) => {
						state.allStudents[student._id] = student;
					});
				} else {
					state.allStudents[action.payload._id] = action.payload;
				}
			},
			prepare: (students: StudentData | StudentData[]) => ({
				payload: students,
			}),
		},
		popAllStudents: (state, action: PayloadAction<string>) => {
			delete state.allStudents[action.payload];
		},
		updateAllStudents: (state, action: PayloadAction<StudentData>) => {
			state.allStudents[action.payload._id] = action.payload;
		},
	},
});

export const {
	setHomeStudents,
	pushHomeStudents,
	popHomeStudents,
	updateHomeStudents,
	setAllStudents,
	pushAllStudents,
	popAllStudents,
	updateAllStudents,
} = studentSlice.actions;

export default studentSlice.reducer;
