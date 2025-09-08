export type ContainerDataResponse = {
	Block: string;
	"CONTAINER GRADE": string;
	Column: string;
	Container: string;
	LOGISTIC: string;
	OWNER: string;
	Row: string;
	STATE: string;
	"TGL FXD": string;
	"TGL. STATUS": string;
	TYPE: string;
	Tier: string;
	"VESSEL TERAKHIR": string;
};

export type ApiResponse = {
	cy: string;
	user: string;
	data: ContainerDataResponse[];
};
