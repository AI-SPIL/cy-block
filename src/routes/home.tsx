import { Link } from "react-router";

export default function Landing() {
	return (
		<div className="flex flex-col gap-y-8 items-center justify-center min-h-svh bg-neutral-900">
			<Link to="/example">
				<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer">Go to example</button>
			</Link>
			<Link to="/old-example">
				<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer">Go to old example</button>
			</Link>
		</div>
	);
}
