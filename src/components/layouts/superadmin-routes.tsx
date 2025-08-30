import type { IUser } from "@/constants/credentials";
import { Navigate, Outlet } from "react-router";
import { toast } from "sonner";

export default function SuperAdminRoutes() {
	try {
		const userStr = localStorage.getItem("user");
		if (!userStr) {
			return <Navigate to="/" replace />;
		}

		const user: IUser = JSON.parse(userStr);

		if (!user || !user.role) {
			return <Navigate to="/" replace />;
		}

		if (user.role !== "superadmin") {
			toast.error("You do not have permission to access this page.");
			const redirectTo = user.permissions && user.permissions.length > 0 ? `/${user.permissions[0]}` : "/";
			return <Navigate to={redirectTo} replace />;
		}

		return <Outlet />;
	} catch (error) {
		console.error("Error in SuperAdminRoutes:", error);
		return <Navigate to="/" replace />;
	}
}
