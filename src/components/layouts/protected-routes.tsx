import type { UserData } from "@/types/auth";
import { Navigate, Outlet, useLoaderData } from "react-router";

export default function ProtectedRoutes() {
	const { user } = (useLoaderData() as { user?: UserData | null }) ?? { user: null };

	if (!user) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
}
