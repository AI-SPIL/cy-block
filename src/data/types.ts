export interface ExampleResponse {
	depo_name: string;
	blocks: {
		block_name: string;
		slots: (
			| {
					container_code: string;
					row: number;
					column: number;
					tier: number;
					size: string;
					grade: null;
			  }
			| {
					container_code: string;
					row: number;
					column: number;
					tier: number;
					size: string;
					grade: string;
			  }
		)[];
	}[];
}
