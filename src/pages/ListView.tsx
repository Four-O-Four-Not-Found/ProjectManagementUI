import React from "react";
import PageHeader from "../components/molecules/PageHeader";
import TimelineView from "../components/organisms/TimelineView";
import Button from "../components/atoms/Button";
import { Download, Filter, Plus } from "lucide-react";

const ListView: React.FC = () => {
	return (
		<div className="h-full flex flex-col space-y-6 pb-10 overflow-hidden">
			<PageHeader
				title="Project Timeline"
				description="Visualize task distribution and delivery milestones across the project lifecycle."
				actions={
					<div className="flex items-center gap-3">
						<Button variant="secondary" leftIcon={<Filter size={16} />}>
							Filter
						</Button>
						<Button variant="secondary" leftIcon={<Download size={16} />}>
							Export
						</Button>
						<Button leftIcon={<Plus size={16} />}>Plan Milestone</Button>
					</div>
				}
			/>

			<div className="flex-1 min-h-0">
				<TimelineView />
			</div>
		</div>
	);
};

export default ListView;
