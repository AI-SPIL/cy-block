import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { IUser } from "@/constants/credentials";
import { ArrowLeft, LogOut } from "lucide-react";
import { Link } from "react-router";

const ROUTES_MAP = [
	{ path: "/depo-4", title: "Depo 4" },
	{ path: "/depo-japfa", title: "Depo Japfa" },
	{ path: "/depo-teluk-bayur", title: "Depo Teluk Bayur" },
	{ path: "/depo-yon", title: "Depo Yon" },
	{ path: "/depo-marunda", title: "Depo Marunda" },
	{ path: "/depo-teluk-langon", title: "Depo Teluk Langon" },
	{ path: "/depo-perca", title: "Depo Perca" },
];

function RoutesDropdown() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="bg-black text-white border font-mono">Page</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-36 bg-black mt-1" align="center">
				{ROUTES_MAP.map((route, idx) => (
					<DropdownMenuItem key={idx} asChild>
						<Link to={route.path} className="text-white">
							{route.title}
						</Link>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default function Navbar({ user }: { user: IUser }) {
	return user.role === "superadmin" ? (
		<div className="w-full flex absolute top-4 px-4 z-[9999] items-center justify-end gap-x-4">
			<Button asChild className="bg-black text-white border font-mono">
				<Link to="/home">
					<ArrowLeft className="size-4" />
					Back
				</Link>
			</Button>
			<RoutesDropdown />
			<Button
				className="bg-black text-white border font-mono"
				onClick={() => {
					localStorage.removeItem("user");
					window.location.href = "/";
				}}
			>
				Logout
				<LogOut className="size-4" />
			</Button>
		</div>
	) : (
		<Button
			className="absolute top-4 right-4 z-[9999] bg-black text-white border font-mono"
			onClick={() => {
				localStorage.removeItem("user");
				window.location.href = "/";
			}}
		>
			Logout
			<LogOut className="size-4" />
		</Button>
	);
}
