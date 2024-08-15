import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the interfaces for exams and assignments
export interface ExamsInterface {
	date: string;
	_id: string;
	batch_name: string;
	subject: string;
}

export interface AddAssignmentInterface {
	_id: string;
	title: string;
	description: string;
}

// Define the combined state interface
interface CombinedState {
	allExams: ExamsInterface[];
	allAssignments: AddAssignmentInterface[];
}

// Define the initial state for both exams and assignments
const initialState: CombinedState = {
	allExams: [],
	allAssignments: [],
};

// Create the combined slice
const combinedSlice = createSlice({
	name: "combined",
	initialState,
	reducers: {
		// Exams reducers
		setAllExam: (state, action: PayloadAction<ExamsInterface[]>) => {
			state.allExams = action.payload;
		},
		pushExam: (state, action: PayloadAction<ExamsInterface>) => {
			state.allExams.push(action.payload);
		},
		popExam: (state, action: PayloadAction<string>) => {
			state.allExams = state.allExams.filter(
				(exam) => exam._id !== action.payload
			);
		},
		updateExam: (state, action: PayloadAction<ExamsInterface>) => {
			state.allExams = state.allExams.map((exam) =>
				exam._id === action.payload._id ? action.payload : exam
			);
		},

		// Assignments reducers
		setAllAssignment: (
			state,
			action: PayloadAction<AddAssignmentInterface[]>
		) => {
			state.allAssignments = action.payload;
		},
		pushAssignment: (state, action: PayloadAction<AddAssignmentInterface>) => {
			state.allAssignments.push(action.payload);
		},
		popAssignment: (state, action: PayloadAction<string>) => {
			state.allAssignments = state.allAssignments.filter(
				(assignment) => assignment._id !== action.payload
			);
		},
		updateAssignment: (
			state,
			action: PayloadAction<AddAssignmentInterface>
		) => {
			state.allAssignments = state.allAssignments.map((assignment) =>
				assignment._id === action.payload._id ? action.payload : assignment
			);
		},
	},
});

// Export actions and reducer
export const {
	setAllExam,
	pushExam,
	popExam,
	updateExam,
	setAllAssignment,
	pushAssignment,
	popAssignment,
	updateAssignment,
} = combinedSlice.actions;

export default combinedSlice.reducer;
