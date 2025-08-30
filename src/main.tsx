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
import { Toaster } from "./components/ui/sonner.tsx";
import { credentials } from "./constants/credentials.ts";
import "./index.css";

const router = createHashRouter([
	{
		path: "/home",
		element: <Landing />,
	},
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
				if (user.role === "superadmin") return redirect("/home");
				return redirect(`/${user.permissions[0]}`);
			}

			toast.error("Invalid credentials");
		},
	},
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
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
		<Toaster position="top-center" />
	</StrictMode>
);
