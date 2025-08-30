import { Loader2 } from "lucide-react";

export default function Loading() {
	return (
		<div className="w-full min-h-dvh grid place-items-center bg-black">
			<Loader2 className="size-6 animate-spin text-white" />
		</div>
	);
}
