import React, { useState, useCallback, useEffect } from "react";
import { NormalEditFunction } from "@/interfaces"; // Adjust the import path as necessary

interface ShowDialogProps {
	buttonFunction?: NormalEditFunction;
	children: React.ReactNode;
	icon: React.ReactNode;
	title?: string;
	buttonClassName?: string;
}

function Popover({
	buttonFunction,
	children,
	icon,
	buttonClassName = "",
}: ShowDialogProps) {
	const [show, setShow] = useState(false);
	const childEvent = useCallback(() => {
		if (buttonFunction) {
			buttonFunction();
		}
		setShow(true);
	}, [buttonFunction]);
	return (
		<>
			<button
				className={`rounded-md ${buttonClassName}`}
				onClick={childEvent}
				id="btn"
			>
				{icon}
			</button>
			{show && (
				<main className="bg-slate-900/45 fixed z-[100] top-0 right-0 w-screen h-screen ">
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full sm:min-w-96 lg:w-1/2 sm:w-2/3 p-2 sm:p-4 border border-slate-500/60 rounded-md bg-slate-950 max-h-[98vh] overflow-auto custom-scrollbar">
						<div className="text-right">
							<i
								className="pi pi-times p-1 border rounded mb-2 cursor-pointer hover:opacity-70 active:scale-90 transition-all"
								onClick={() => setShow(false)}
							></i>
						</div>
						<div
							className="border rounded border-slate-400/40 p-2 z-20 relative min-h-[25vh] content-center"
							id="form-element"
						>
							{children}
						</div>
					</div>
				</main>
			)}
		</>
	);
}

export default Popover;
