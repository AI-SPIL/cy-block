import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Link } from "react-router";

export default function Landing() {
	return (
		<div className="flex flex-col gap-y-8 items-center justify-center min-h-svh bg-neutral-900">
			<Button
				variant="destructive"
				onClick={() => {
					localStorage.removeItem("user");
					window.location.href = "/";
				}}
			>
				Logout <LogOut className="size-4" />
			</Button>
			<Button asChild className="bg-blue-500 text-white">
				<Link to="/depo-4">Go to Depo 4</Link>
			</Button>
			<Button asChild className="bg-blue-500 text-white">
				<Link to="/depo-japfa">Go to Depo Japfa</Link>
			</Button>
			<Button asChild className="bg-blue-500 text-white">
				<Link to="/depo-teluk-bayur">Go to Depo Teluk Bayur</Link>
			</Button>
			<Button asChild className="bg-blue-500 text-white">
				<Link to="/depo-yon">Go to Depo Yon</Link>
			</Button>
		</div>
	);
}
