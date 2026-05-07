import React from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from "recharts";

interface WorkloadData {
	name: string;
	tasks: number;
	color: string;
}

interface WorkloadChartProps {
	data: WorkloadData[];
}

const WorkloadChart: React.FC<WorkloadChartProps> = ({ data }) => {
	return (
		<div className="w-full h-[200px]">
			<ResponsiveContainer width="100%" height="100%" minHeight={200} minWidth={300} debounce={50}>
				<BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
					<CartesianGrid
						strokeDasharray="3 3"
						horizontal={true}
						vertical={false}
						stroke="var(--border)"
						opacity={0.5}
					/>
					<XAxis type="number" hide />
					<YAxis
						dataKey="name"
						type="category"
						stroke="var(--text-muted)"
						fontSize={10}
						width={80}
						tickLine={false}
						axisLine={false}
					/>
					<Tooltip
						cursor={{ fill: "var(--surface-hover)", opacity: 0.4 }}
						contentStyle={{
							backgroundColor: "var(--surface)",
							borderColor: "var(--border)",
							borderRadius: "12px",
							fontSize: "12px",
							color: "var(--text-main)",
							boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
						}}
					/>
					<Bar dataKey="tasks" radius={[0, 4, 4, 0]} barSize={12}>
						{data.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default WorkloadChart;
