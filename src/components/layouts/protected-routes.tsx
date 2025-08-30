import type { IUser } from "@/constants/credentials";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoutes() {
	try {
		const userStr = localStorage.getItem("user");
		if (!userStr) {
			return <Navigate to="/" replace />;
		}

		const user: IUser = JSON.parse(userStr);

		if (!user || !user.role) {
			return <Navigate to="/" replace />;
		}

		return <Outlet />;
	} catch (error) {
		console.error("Error in ProtectedRoutes:", error);
		return <Navigate to="/" replace />;
	}
}
