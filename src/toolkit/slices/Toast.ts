// toastSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToastState {
  severity: string;
  summary: string;
  detail: string;
  visible: boolean;
}

const initialState: ToastState = {
  severity: '',
  summary: '',
  detail: '',
  visible: false,
};

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<ToastState>) => {
      state.severity = action.payload.severity;
      state.summary = action.payload.summary;
      state.detail = action.payload.detail;
      state.visible = true;
    },
    hideToast: (state) => {
      state.visible = false;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;

export default toastSlice.reducer;
