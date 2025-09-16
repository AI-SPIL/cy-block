/* eslint-disable @typescript-eslint/no-explicit-any */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, redirect, RouterProvider } from "react-router";

import Depo4 from "./routes/authenticated/depo-4.tsx";
import DepoJapfa from "./routes/authenticated/depo-japfa.tsx";
import DepoTelukBayur from "./routes/authenticated/depo-teluk-bayur.tsx";
import DepoYon from "./routes/authenticated/depo-yon.tsx";
import Landing from "./routes/home.tsx";
import Login from "./routes/login.tsx";
import AdminRoutes from "./components/layouts/admin-routes.tsx";
import ProtectedRoutes from "./components/layouts/protected-routes.tsx";
import SuperAdminRoutes from "./components/layouts/superadmin-routes.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { api } from "./lib/axios.ts";

import type { Depo, DepoDetail, Slot } from "./types/main.ts";
import type { LoginResponse, UserData } from "./types/auth.ts";
import type { SuccessApiResponse } from "./types/api.ts";

import "./index.css";

interface DepoDetailWithAvailableSlots extends DepoDetail {
	available_slots: Slot[];
}

const router = createBrowserRouter([
	{
		path: "/",
		element: <Login />,
		action: async ({ request }) => {
			const formData = await request.formData();
			const username = formData.get("username");
			const password = formData.get("password");

			try {
				const response = await api.post<LoginResponse>("/auth/login", { username, password });
				const user = response.data;

				if (user.permissions === "ALL") {
					return redirect("/home");
				}

				if (user.depo_id) {
					return redirect(`/depo/${user.depo_id}`);
				}

				return "/";
			} catch (error: any) {
				let errorMessage = "Login failed. Please check your credentials.";

				if (error?.response?.data?.message) {
					errorMessage = error.response.data.message;
				} else if (error?.data?.message) {
					errorMessage = error.data.message;
				} else if (error?.message) {
					errorMessage = error.message;
				}

				return { error: errorMessage };
			}
		},
	},
	{
		path: "/logout",
		loader: async () => {
			try {
				await api.post("/auth/logout");
				return redirect("/");
			} catch (error) {
				console.error("Logout error:", error);
			}
		},
	},
	{
		id: "protected",
		element: <ProtectedRoutes />,
		loader: async () => {
			try {
				const response = await api.get<SuccessApiResponse<UserData>>("/auth/me");
				return { user: response.data };
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (_) {
				return { user: null };
			}
		},
		children: [
			{
				element: <SuperAdminRoutes />,
				children: [
					{
						path: "/home",
						loader: async () => {
							const response = await api.get<SuccessApiResponse<Depo[]>>("/depo");
							return { data: response.data };
						},
						element: <Landing />,
					},
				],
			},
			{
				element: <AdminRoutes />,
				children: [
					{
						path: "/depo-japfa",
						element: <DepoJapfa />,
					},
					{
						path: "/depo-4",
						element: <Depo4 />,
					},
					{
						path: "/depo-teluk-bayur",
						element: <DepoTelukBayur />,
					},
					{
						path: "/depo/:depoId",
						loader: async ({ params: { depoId } }) => {
							const [depoResponse, slotsResponse] = await Promise.all([
								api.get<SuccessApiResponse<DepoDetail>>(`/depo/${depoId}`),
								api.get<DepoDetailWithAvailableSlots>(`/depo/${depoId}/available-slots`)
							]);

							return {
								data: depoResponse.data,
								availableSlots: slotsResponse.data
							};
						},
						element: <DepoYon />,
					},
				],
			},
		],
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
		<Toaster position="top-center" />
	</StrictMode>
);
