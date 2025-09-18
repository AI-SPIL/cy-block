interface BaseApiResponse {
	success: boolean;
	message: string;
}

export interface SuccessApiResponse<T> extends BaseApiResponse {
	data: T;
}

export interface ErrorApiResponse extends BaseApiResponse {
	error: string | string[] | Record<string, string>;
}

export type ContainerDataResponse = {
	Container: string;
	Block: string;
	Row: number;
	Column: number;
	Tier: number;
	STATE: string;
	TYPE: string;
	LOGISTIC: string;
	OWNER: string;
	"TGL. STATUS": string;
	"TGL FXD": string;
	"CONTAINER GRADE": string;
	"VESSEL TERAKHIR": string;
};

export type ApiResponse = {
	cy: string;
	user: string;
	data: ContainerDataResponse[];
};
