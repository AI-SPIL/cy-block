import DisplayYard from "@/components/display-yard";
import { useLoaderData } from "react-router";

export default function DepoYon() {
	const { data } = useLoaderData();

	return <DisplayYard name="YON" data={data} containerSize={{ size20: [7.13, 2.6, 2.64], size40: [2.64, 2.6, 15.3] }} />;
}
