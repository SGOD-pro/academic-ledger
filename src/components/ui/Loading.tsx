import React, { memo } from "react";

function Loading({
	children,
	loading,
}: {
	children: React.ReactNode;
	loading: boolean;
}) {
	return (
		<>
			{loading ? (
				<div className="absolute top-0 left-0 w-full h-full animate-pulse bg-slate-700"></div>
			) : (
				 children 
			)}
		</>
	);
}

export default memo(Loading);
