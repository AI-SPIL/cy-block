import { Navigate, Outlet, useLocation, useRouteLoaderData } from "react-router";
import { toast } from "sonner";
import type { UserData } from "@/types/auth";
import Navbar from "./components/navbar";

export default function AdminRoutes() {
	const location = useLocation();
	const { user } = (useRouteLoaderData("protected") as { user?: UserData }) ?? {};

	const hasPermission = (permission: string): boolean => {
		if (!user) return false;
		return user.permissions === "ALL" || user.permissions === permission;
	};

	const pathSegments = location.pathname.split("/").filter(Boolean);
	const depoName = pathSegments[0] || "";

	const depoPermissionMap: Record<string, string> = {
		"depo-4": "DEPO_4",
		"depo-japfa": "JAPFA",
		"depo-teluk-bayur": "TELUK_BAYUR",
		"depo-yon": "YON",
		"depo-marunda": "MARUNDA",
		"depo-tambak-langon": "TAMBAK_LANGON",
		"depo-perca": "PERCA",
	};

	const requiredPermission = depoPermissionMap[depoName];
	const isAllowed = hasPermission(requiredPermission) || hasPermission("ALL");

	if (!isAllowed) {
		toast.error("You do not have permission to access this page.");
		if (hasPermission("ALL")) {
			return <Navigate to="/home" replace />;
		} else {
			const userDepo = user?.depo_id;
			if (userDepo) {
				return <Navigate to={`/depo/${userDepo}`} replace />;
			}
			return <Navigate to="/" replace />;
		}
	}

	return (
		<div className="relative min-h-dvh w-full overflow-hidden">
			<Navbar user={user!} />
			<Outlet />
		</div>
	);
}
