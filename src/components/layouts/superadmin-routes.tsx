import { Navigate, Outlet, useRouteLoaderData } from "react-router";
import { toast } from "sonner";
import type { UserData } from "@/types/auth";

export default function SuperAdminRoutes() {
	const { user } = (useRouteLoaderData("protected") as { user?: UserData }) ?? {};

	const hasPermission = (permission: string): boolean => {
		if (!user) return false;
		return user.permissions === "ALL" || user.permissions === permission;
	};

	if (!hasPermission("ALL")) {
		toast.error("You do not have permission to access this page.");
		if (user?.depo_id) {
			return <Navigate to={`/depo/${user.depo_id}`} replace />;
		}
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
}
