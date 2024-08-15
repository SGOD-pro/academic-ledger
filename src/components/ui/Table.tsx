import React, { memo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface Columns {
	field: string;
	header: string;
}

interface TableProps {
	columns: Columns[];
	values: any[];
	Components?: React.ElementType; // Updated to accept a React component type
	border?: boolean;
}

function BasicDemo({ columns, values, Components, border }: TableProps) {
	return (
		<div className="card m-0 p-0">
			<DataTable
				value={values}
				tableStyle={{ minWidth: "17rem", width: "100%", padding: 0, margin: 0 }}
				className="m-0 p-0"
			>
				{columns?.map((data, index) => (
					<Column
						field={data.field}
						header={data.header}
						key={index}
						className={border ? "border-b" : ""}
					/>
				))}
				{Components && (
					<Column
						key="action"
						body={(rowData) => <Components rowData={rowData} />}
						header="Actions"
						align="center"
						className={`${border ? "border-b" : ""} " text-center"`}
					/>
				)}
			</DataTable>
		</div>
	);
}

// Assigning displayName to the component
BasicDemo.displayName = "BasicDemo";

export default memo(BasicDemo);
