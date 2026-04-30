import React from "react";
import {
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	AreaChart,
	Area,
} from "recharts";

const data = [
	{ day: "Day 1", ideal: 100, actual: 100 },
	{ day: "Day 2", ideal: 85, actual: 92 },
	{ day: "Day 3", ideal: 70, actual: 78 },
	{ day: "Day 4", ideal: 55, actual: 60 },
	{ day: "Day 5", ideal: 40, actual: 42 },
	{ day: "Day 6", ideal: 25, actual: 20 },
	{ day: "Day 7", ideal: 10, actual: 5 },
];

const BurndownChart: React.FC = () => {
	return (
		<div className="w-full h-[300px] mt-4">
			<ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
				<AreaChart data={data}>
					<defs>
						<linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
							<stop
								offset="5%"
								stopColor="var(--github-blue)"
								stopOpacity={0.3}
							/>
							<stop
								offset="95%"
								stopColor="var(--github-blue)"
								stopOpacity={0}
							/>
						</linearGradient>
					</defs>
					<CartesianGrid
						strokeDasharray="3 3"
						stroke="var(--border)"
						vertical={false}
					/>
					<XAxis
						dataKey="day"
						stroke="var(--text-muted)"
						fontSize={10}
						tickLine={false}
						axisLine={false}
					/>
					<YAxis
						stroke="var(--text-muted)"
						fontSize={10}
						tickLine={false}
						axisLine={false}
						tickFormatter={(value) => `${value}%`}
					/>
					<Tooltip
						contentStyle={{
							backgroundColor: "var(--surface)",
							borderColor: "var(--border)",
							borderRadius: "8px",
							fontSize: "12px",
							color: "var(--text-main)",
						}}
						itemStyle={{ color: "var(--text-main)" }}
					/>
					<Area
						type="monotone"
						dataKey="actual"
						stroke="var(--github-blue)"
						fillOpacity={1}
						fill="url(#colorActual)"
						strokeWidth={3}
					/>
					<Line
						type="monotone"
						dataKey="ideal"
						stroke="var(--text-muted)"
						strokeDasharray="5 5"
						dot={false}
						strokeWidth={1}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
};

export default BurndownChart;
