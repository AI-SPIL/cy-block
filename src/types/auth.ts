type UserPermissions = "ALL" | "DEPO_4" | "YON" | "JAPFA" | "TELUK_BAYUR" | "MARUNDA" | "PERCA" | "TAMBAK_LANGON";

export type LoginResponse = {
	username: string;
	permissions: UserPermissions;
	depo_id: string | null;
};

export type UserData = {
	username: string;
	permissions: UserPermissions;
	depo_id: string | null;
	id: string;
};

export type AuthResponse = {
	success: boolean;
	message: string;
	data: UserData;
};