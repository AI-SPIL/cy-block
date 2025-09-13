import DisplayYard from "@/components/display-yard";
import type { DepoDetail, Slot } from "@/types/main";

// Define the actual API response structure for available slots
interface DepoDetailWithAvailableSlots extends DepoDetail {
	available_slots: Slot[];
}
import { useLoaderData } from "react-router";

export default function DepoYon() {
	const { data, availableSlots } = useLoaderData<{ 
		data: DepoDetail | undefined; 
		availableSlots: DepoDetailWithAvailableSlots | undefined 
	}>();

	return <DisplayYard 
		name="YON" 
		data={data} 
		availableSlots={availableSlots}
		containerSize={{ size20: [7.13, 2.6, 2.64], size40: [2.64, 2.6, 15.3] }} 
	/>;
}
