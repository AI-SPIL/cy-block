import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";
import Depo4 from "./routes/authenticated/depo-4.tsx";
import DepoJapfa from "./routes/authenticated/depo-japfa.tsx";
import DepoTelukBayur from "./routes/authenticated/depo-teluk-bayur.tsx";
import DepoYon from "./routes/authenticated/depo-yon.tsx";
import Example from "./routes/example.tsx";
import Landing from "./routes/home.tsx";
import Login from "./routes/login.tsx";
import OldExample from "./routes/old-example.tsx";

import "./index.css";

const router = createHashRouter([
	{
		path: "/",
		element: <Landing />,
	},
	{
		path: "/example",
		element: <Example />,
	},
	{
		path: "/old-example",
		element: <OldExample />,
	},
	{
		path: "/login",
		element: <Login />,
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
	</StrictMode>
);
