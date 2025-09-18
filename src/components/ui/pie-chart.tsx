import { Pie, PieChart } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const chartConfig = {
	value: {
		label: "Value",
	},
} satisfies ChartConfig;

type ChartPieProps = {
	chartData: {
		name: string;
		value: number;
		fill?: string;
	}[];
	title: string;
	description: string;
};

export function ChartPie({ chartData, title, description }: ChartPieProps) {
	return (
		<Card className="flex flex-col bg-black/10 border-none backdrop-blur-lg">
			<CardHeader className="items-center pb-0">
				<CardTitle className="text-center text-white">{title}</CardTitle>
				<CardDescription className="text-center text-white/70">
					{format(Date.now(), "MMMM dd yyyy", { locale: id })}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[250px]"
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie data={chartData} dataKey="value" nameKey="name" />
					</PieChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col gap-2 text-sm">
				<div className="text-white/80 leading-none">{description}</div>
			</CardFooter>
		</Card>
	);
}
