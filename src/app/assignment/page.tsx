"use client";
import React, { useState, useEffect, memo, lazy, Suspense } from "react";
const Editor = lazy(() => import("@/components/Editor"));
const Header = lazy(() => import("@/components/ui/Header"));
const AddAssignment = lazy(() => import("./AddAssignment"));
import Link from "next/link";
import LazyLoading from "@/components/ui/LazyLoading";
function Assignment() {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const handleDOMContentLoaded = () => {
			setLoading(false);
		};
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
		} else {
			handleDOMContentLoaded();
		}

		return () => {
			document.removeEventListener("DOMContentLoaded", handleDOMContentLoaded);
		};
	}, []);
	const [menu, setmenu] = useState(true);
	const menubar = () => {
		setmenu((prev) => !prev);
	};

	return (
		<div className="w-full h-full rounded-lg sm:rounded-l-[20px] md:rounded-l-[44px] border border-slate-400/70 overflow-hidden">
			<Header title="Assignments">
				<Link
					href="/all/show-assignments"
					className="text-emerald-400 underline text-xs sm:text-base"
				>
					Show Assignments
				</Link>
			</Header>
			<div className="w-full h-[calc(100%-3.5rem)] overflow-hidden bg-[#1f2937] custom-scrollbar relative pt-2">
				<div className="md:m-auto bg-slate-950 sm:w-56 sm:mx-0 mx-1 rounded-lg p-2">
					<div
						className="flex items-center justify-around p-1 relative rounded-md cursor-pointer overflow-hidden"
						onClick={menubar}
					>
						<div
							className={` absolute w-1/2 h-full left-0 ${
								menu ? "translate-x-0" : "translate-x-full"
							} transition-all`}
						>
							<div className="bg-slate-900 w-full h-full rounded p-2"></div>
						</div>
						<p
							className={`z-10 pointer-events-none ${
								!menu && "text-white/40"
							} selection:pointer-events-none`}
						>
							Text Editor
						</p>
						<p
							className={`z-10 pointer-events-none ${
								menu && "text-white/40"
							} selection:pointer-events-none`}
						>
							Upload file
						</p>
					</div>
				</div>

				<section className="h-[80vh] w-[200%] flex relative mt-2">
					<div
						className={`w-full ${
							!menu ? "-translate-x-1/2" : "translate-x-0"
						} transition-all h-full flex`}
					>
						<aside className="w-1/2 h-full min-h-[50vh] relative">
							<Suspense fallback={<LazyLoading />}>
								<Editor />
							</Suspense>
						</aside>
						<aside className="w-1/2 h-full relative">
							<Suspense fallback={<LazyLoading />}>
								<AddAssignment />
							</Suspense>
						</aside>
					</div>
				</section>
			</div>
		</div>
	);
}

export default memo(Assignment);
