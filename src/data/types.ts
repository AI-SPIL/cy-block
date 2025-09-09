export interface ExampleResponse {
	id: string;
	depo_name: string;
	depo_blocks: {
		block_name: string;
		block_slots: {
			container_code: string;
			column: number;
			row: number;
			tier: number;
			size: string;
			grade: string | null;
			status:
				| "MTD"
				| "MTA"
				| "MTS"
				| "MTB"
				| "FTL"
				| "STR"
				| "MNA"
				| "FXD"
				| "FIT";
		}[];
	}[];
}
