import type { IUser } from "@/constants/credentials";
import { Navigate, Outlet, useLocation } from "react-router";
import { toast } from "sonner";
import Navbar from "./components/navbar";

export default function AdminRoutes() {
	const location = useLocation();

	try {
		const userStr = localStorage.getItem("user");
		if (!userStr) {
			return <Navigate to="/" replace />;
		}

		const user: IUser = JSON.parse(userStr);

		if (!user || !user.role) {
			return <Navigate to="/" replace />;
		}

		const pathSegments = location.pathname.split("/").filter(Boolean);
		const targetPath = pathSegments[0] ? pathSegments[0] : "";
		const isAllowed = user.permissions.includes(targetPath);

		if (!isAllowed) {
			toast.error("You do not have permission to access this page.");
			const redirectTo = user.permissions && user.permissions.length > 0 ? `/${user.permissions[0]}` : "/";
			return <Navigate to={redirectTo} replace />;
		}

		return (
			<div className="relative min-h-dvh w-full overflow-hidden">
				<Navbar user={user} />
				<Outlet />
			</div>
		);
	} catch (error) {
		console.error("Error in SuperAdminRoutes:", error);
		return <Navigate to="/" replace />;
	}
}
