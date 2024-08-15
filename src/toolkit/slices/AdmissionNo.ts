import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
	latestAdmissionNo: "",
};

const admissionNo = createSlice({
	initialState,
	name: "admissionNo",
	reducers: {
		setAdmissionNo: (state, action: PayloadAction<string>) => {
			state.latestAdmissionNo = action.payload;
		},
		updateAdmissionNo: (state, action: PayloadAction<string>) => {
			const lastDigit = action.payload.split("-");
			state.latestAdmissionNo = `CA-${new Date().getFullYear() % 100}/${
				(new Date().getFullYear() % 100) + 1
			}-${
				(lastDigit &&
				Array.isArray(lastDigit) &&
				+lastDigit[lastDigit.length - 1]
					? +lastDigit[lastDigit.length - 1]
					: 0) + 1
			}`;
		},
	},
});

export const { setAdmissionNo,updateAdmissionNo } = admissionNo.actions;
export default admissionNo.reducer;
