import React, { memo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Image from "next/image";

interface ColumnProps {
	field: string;
	header: string;
}

interface TableProps {
	columns: ColumnProps[];
	values: any[];
	Components?: React.ElementType; // Updated to accept a React component type
}

const RemovableSortDemo: React.FC<TableProps> = ({
	columns,
	values,
	Components,
}) => {
	const representativeBodyTemplate = (rowData: any) => {
		if (!rowData.picture) {
			return <span>{rowData.name}</span>;
		}
		return (
			<div className="flex items-center gap-2">
				<div className="w-11 h-11 rounded-full overflow-hidden">
					<Image
						src={"/default.jpg"}
						alt={rowData.name[0]}
						className="w-full h-full object-cover object-center"
						width={56}
						height={56}
					/>
					<h2>Pic</h2>
				</div>
				<span>{rowData.name}</span>
			</div>
		);
	};

	return (
		<div className="card w-full">
			<DataTable
				value={values}
				sortMode="multiple"
				tableStyle={{ minWidth: "500px", backgroundColor:"transparent" }}
				className="px-2"
                
			>
				{columns.map((col) => (
					<Column
						key={col.field}
						sortable
						field={col.field}
						header={col.header}
						className="border-slate-500/60 border-b"
						body={col.field === "name" ? representativeBodyTemplate : undefined}
					/>
				))}
				{Components && (
					<Column
						key="actions"
						header="Actions"
                        align="right"
						className="border-slate-500/60 border-b"
						body={(rowData) => <Components rowData={rowData} />} // Render the component correctly
					/>
				)}
			</DataTable>
		</div>
	);
};

export default memo(RemovableSortDemo);
