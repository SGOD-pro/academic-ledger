import React, { memo } from "react";

function Loading() {
	return (
		<>
				<div className="absolute top-0 left-0 w-full h-full animate-pulse bg-slate-700"></div>
			
		</>
	);
}

export default memo(Loading);
