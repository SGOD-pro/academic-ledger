import { configureStore } from "@reduxjs/toolkit";
import Students from "./slices/Students";
import Subjects from "./slices/Subjects";
import Batches from "./slices/SubjectBatch";
import AssignmentExam from "./slices/AssignmentsExam";
import AdmissionNo from "./slices/AdmissionNo";
import Toast from "./slices/Toast";

const store = configureStore({
	reducer: {
		Students,
		Subjects,
		Batches,
		AssignmentExam,
		toast: Toast,
		AdmissionNo,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
