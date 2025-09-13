export type ContainerSize = "SIZE_20" | "SIZE_40";

export type ContainerGrade = "A" | "B" | "C";

export type ContainerStatus = "MTA" | "MNA" | "MTS" | "MTB" | "MTD" | "FXD" | "FTL" | "FIT" | "STR";

export type Container = {
	id: string;
	code: string;
	block: string;
	row: number;
	column: number;
	tier: number;
	logistic: boolean;
	owner: string;
	size: ContainerSize;
	status: ContainerStatus;
	grade: ContainerGrade;
	fxd_date: string | null;
	status_date: string | null;
	vessel_voyage: string;
	updated_at: string;
};

export type Block = {
	id: string;
	name: string;
	total_row: number;
	total_column: number;
	tier_maximum: number;
	containers: Container[];
};

export interface Depo {
	id: string;
	name: string;
}

export interface DepoDetail extends Depo {
	ground_slots: string;
	max_capacity: string;
	blocks: Block[];
}

export type Slot = {
	id: string;
	block: string;
	row: number;
	column: number;
	tier: number
}

export type AvailableSlot = {
	id: string
	name: string;
	available_slots: Slot[]
}
