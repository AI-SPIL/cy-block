import { Link } from "react-router";

export default function Landing() {
	return (
		<div className="flex flex-col gap-y-8 items-center justify-center min-h-svh bg-neutral-900">
			<Link to="/depo-4">
				<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer">
					Go to Depo 4
				</button>
			</Link>
			<Link to="/depo-japfa">
				<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer">
					Go to Depo Japfa
				</button>
			</Link>
			<Link to="/depo-teluk-bayur">
				<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer">
					Go to Depo Teluk Bayur
				</button>
			</Link>
			<Link to="/depo-yon">
				<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer">
					Go to Depo Yon
				</button>
			</Link>
		</div>
	);
}
