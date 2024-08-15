import React, { memo, useEffect, useState, useCallback } from "react";
import Select from "./Select";
import { SelectInterface, EditFunction } from "@/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "@/toolkit";

interface Batch {
    label?: string;
    subject: string;
    setBatchValue: React.Dispatch<React.SetStateAction<SelectInterface>>;
    batchValue?: SelectInterface | null;
    batchChangeFunction?: EditFunction;
}

export function getBatches(allBatches: any[], subject: string) {
    return allBatches
        .filter((batch: any) => batch.subject === subject)
        .map((batch: any) => ({
            name: `${batch.days} (${batch.time})`,
            code: batch._id,
        }));
}

function GetBatch({
    label,
    subject,
    setBatchValue,
    batchValue,
    batchChangeFunction,
}: Batch) {
    const [batchValues, setBatchValues] = useState<SelectInterface[] | null>(null);
    const [batch, setBatch] = useState<SelectInterface | null>(null);

    const batches = useSelector((state: RootState) => state.Batches.allBatches);

    // Memoize the batchChangeFunction if it's likely to change frequently
    const handleBatchChange = useCallback((value: SelectInterface | null) => {
        setBatch(value);
		if (value) {
			setBatchValue(value);
		}
        if (batchChangeFunction) {
            batchChangeFunction({ value: value?.code || "", subject: subject });
        }
    }, [setBatchValue, batchChangeFunction, subject]);

    useEffect(() => {
        const filteredBatches = getBatches(batches, subject);
        setBatchValues(filteredBatches);
        if (batchChangeFunction && batchValue) {
            batchChangeFunction(batchValue);
        }
        setBatch(batchValue || null);
    }, [subject, batchValue, batches, batchChangeFunction]);

    return (
        <div className="flex flex-wrap w-full h-fit lg:basis-44 lg:flex-grow lg:flex-shrink text-left">
            {label && (
                <label className="flex-grow flex-shrink basis-24">{label}</label>
            )}
            <div className="card flex justify-content-center flex-grow flex-shrink basis-44 rounded-md text-xs">
                <Select
                    options={batchValues}
                    handleChange={(e) => handleBatchChange(e.value)}
                    value={batch}
                    placeholder={"Batch"}
                    id={subject}
                />
            </div>
        </div>
    );
}

export default memo(GetBatch);
