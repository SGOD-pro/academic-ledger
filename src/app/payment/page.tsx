"use client";

import Header from "@/components/ui/Header";
import LazyLoading from "@/components/ui/LazyLoading";
import Popover from "@/components/ui/Popover";
import useToast from "@/hooks/ToastHook";
import axios from "axios";
import React, { memo, useRef, useCallback, lazy, Suspense } from "react";
const PaymentForm = lazy(() => import("@/components/PaymentForm"));
const Table = lazy(() => import("@/components/ui/Table"));
import { monthsDifference, getNextMonth, extractDate } from "@/helper/DateTime";

import {validAdmissionNo} from "@/helper/Validation"

interface PaymentInterface {
    month: string;
    paymentDate: string | null;
}

function PaymentPage() {
    const { show } = useToast();
    const inputRef = useRef<HTMLInputElement>(null);
    const [data, setData] = React.useState<PaymentInterface[]>([]);
    const [name, setName] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    const searchStudent = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputRef.current?.value) {
            return;
        }

        const admissionNo = inputRef.current.value;
        if (!validAdmissionNo(admissionNo)) {
            show({
                detail: "Invalid Admission No",
                type: "warn",
                summary: "WARNING",
            });
            return;
        }

        setLoading(true);
        axios.get(`/api/payment?id=${admissionNo}`)
            .then((res) => {
                const data = res.data.data;
                setName(data.name);

                const currentDate = new Date();
                let loop = monthsDifference(data.admissionDate, currentDate.toISOString());

                const feesPaidDetails = data.feesPaidDetails || [];
                loop = Math.max(loop, feesPaidDetails.length);

                const paymentData: PaymentInterface[] = [];
                const admissionDate = data.admissionDate;

                paymentData.push({
                    month: extractDate(admissionDate),
                    paymentDate: feesPaidDetails.length > 0 ? extractDate(feesPaidDetails[0]) : "NIL",
                });

                let nextMonth = getNextMonth(admissionDate);
                for (let i = 1; i <= loop; i++) {
                    paymentData.push({
                        month: extractDate(nextMonth),
                        paymentDate: feesPaidDetails[i] ? extractDate(feesPaidDetails[i]) : "NIL",
                    });
                    nextMonth = getNextMonth(nextMonth);
                }

                setData(paymentData);
            })
            .catch((err) => {
                show({
                    detail: err.response?.data.message || err.message || "Something went wrong",
                    type: "error",
                    summary: "ERROR",
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [show]);

    return (
        <div className="w-full h-full rounded-lg sm:rounded-l-[20px] md:rounded-l-[44px] border border-slate-400/70 overflow-hidden">
            <Header title="Make Payments">
                <form
                    action=""
                    className="flex gap-2 items-stretch"
                    onSubmit={searchStudent}
                >
                    <input
                        type="text"
                        className="bg-[#374151] px-3 py-2 rounded-md outline-none"
                        placeholder="Admission no"
                        ref={inputRef}
                    />
                    <button
                        className="rounded-md border border-teal-600 hover:bg-teal-500/60 hover:text-white transition"
                        disabled={loading}
                    >
                        {loading ? <i className="pi pi-search p-3"></i> : <i className="pi pi-search p-3"></i>}
                    </button>
                </form>
                <Popover
                    icon={<i className="pi pi-indian-rupee p-3"></i>}
                    buttonClassName={`border rounded-md hover:bg-white/60 hover:text-black transition ${loading && "pointer-events-none grayscale"}`}
                >
                    <Suspense fallback={<LazyLoading />}>
                        <PaymentForm />
                    </Suspense>
                </Popover>
            </Header>
            <main className="w-full h-[calc(100%-3.5rem)] overflow-auto bg-[#1f2937] custom-scrollbar relative">
                <div className="w-full h-full overflow-auto">
                    {name && (
                        <h1 className="text-xl font-semibold px-4">
                            Name:- <span className="text-teal-500 font-bold">{name}</span>
                        </h1>
                    )}
                    <Suspense fallback={<LazyLoading />}>
                        <Table
                            columns={[
                                { header: "Month", field: "month" },
                                { header: "Payment Date", field: "paymentDate" },
                            ]}
                            values={data}
                        />
                    </Suspense>
                </div>
            </main>
        </div>
    );
}

export default memo(PaymentPage);
