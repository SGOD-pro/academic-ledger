// ToastComponent.tsx
"use client"
import React, { memo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/toolkit";
import { Toast } from "primereact/toast";
import { hideToast } from "@/toolkit/slices/Toast";

const ToastComponent: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { severity, summary, detail, visible } = useSelector(
        (state: RootState) => state.toast
    );

    const toastRef = useRef<any>(null);

    useEffect(() => {
        if (visible) {
            toastRef.current.show({
                severity,
                summary,
                detail,
            });
            dispatch(hideToast());
        }
    }, [visible, severity, summary, detail, dispatch]);

    return <Toast className=" z-50" ref={toastRef} />;
};

export default memo(ToastComponent);
