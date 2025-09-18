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
		availableSlots: DepoDetailWithAvailableSlots | undefined;
	}>();

	return (
		<DisplayYard
			name="YON"
			data={data}
			availableSlots={availableSlots}
			containerSize={{
				size20: [0.006594, 0.003, 0.002442],
				size40: [0.002442, 0.003, 0.0142],
			}}
		/>
	);
}
