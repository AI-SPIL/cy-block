import { Button } from "@/components/ui/button";
import type { Depo } from "@/types/main";
import { LogOut } from "lucide-react";
import { Link, useLoaderData } from "react-router";

export default function Landing() {
	const { data } = useLoaderData<{ data: Depo[] | undefined }>();

	return (
		<div className="flex flex-col gap-y-8 items-center justify-center min-h-svh bg-neutral-900">
			<Button asChild variant="destructive">
				<Link to="/logout">
					Logout <LogOut className="size-4" />
				</Link>
			</Button>
			{data?.map((depo) => (
				<Button key={depo.id} asChild className="bg-blue-500 hover:bg-blue-600 text-white">
					<Link to={`/depo/${depo.id}`}>Go to {depo.name}</Link>
				</Button>
			))}
		</div>
	);
}
