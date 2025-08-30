import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, redirect, RouterProvider } from "react-router";
import Depo4 from "./routes/authenticated/depo-4.tsx";
import DepoJapfa from "./routes/authenticated/depo-japfa.tsx";
import DepoTelukBayur from "./routes/authenticated/depo-teluk-bayur.tsx";
import DepoYon from "./routes/authenticated/depo-yon.tsx";
import Landing from "./routes/home.tsx";
import Login from "./routes/login.tsx";

import { toast } from "sonner";
import AdminRoutes from "./components/layouts/admin-routes.tsx";
import ProtectedRoutes from "./components/layouts/protected-routes.tsx";
import SuperAdminRoutes from "./components/layouts/superadmin-routes.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { credentials } from "./constants/credentials.ts";
import "./index.css";

const router = createHashRouter([
	{
		path: "/",
		element: <Login />,
		action: async ({ request }) => {
			const formData = await request.formData();
			const email = formData.get("email");
			const password = formData.get("password");

			const user = credentials.find((cred) => cred.email === email && cred.password === password);

			if (user) {
				toast.error("Login success");
				localStorage.setItem("user", JSON.stringify(user));
				if (user.role === "superadmin") return redirect("/home");
				return redirect(`/${user.permissions[0]}`);
			}

			toast.error("Invalid credentials");
		},
	},
	{
		element: <ProtectedRoutes />,
		children: [
			{
				element: <SuperAdminRoutes />,
				children: [
					{
						path: "/home",
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
						path: "/depo-yon",
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
