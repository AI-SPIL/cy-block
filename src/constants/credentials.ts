export interface IUser {
	role: string;
	email: string;
	password: string;
	permissions: string[];
}

export const credentials = [
	{
		role: "superadmin",
		email: "superadmin@gmail.com",
		password: "Superadmin#123",
		permissions: ["depo-4", "depo-japfa", "depo-teluk-bayur", "depo-yon", "depo-marunda", "depo-tambak-langon", "depo-perca"],
	},
	{
		role: "admin-depo-4",
		email: "admin-depo-4@gmail.com",
		password: "AdminDepo4#123",
		permissions: ["depo-4"],
	},
	{
		role: "admin-depo-japfa",
		email: "admin-depo-japfa@gmail.com",
		password: "AdminDepoJapfa#123",
		permissions: ["depo-japfa"],
	},
	{
		role: "admin-depo-teluk-bayur",
		email: "admin-depo-teluk-bayur@gmail.com",
		password: "AdminDepoTelukBayur#123",
		permissions: ["depo-teluk-bayur"],
	},
	{
		role: "admin-depo-yon",
		email: "admin-depo-yon@gmail.com",
		password: "AdminDepoYon#123",
		permissions: ["depo-yon"],
	},
	{
		role: "admin-depo-marunda",
		email: "admin-depo-marunda@gmail.com",
		password: "AdminDepoMarunda#123",
		permissions: ["depo-marunda"],
	},
	{
		role: "admin-depo-tambak-langon",
		email: "admin-depo-tambak-langon@gmail.com",
		password: "AdminDepoTambakLangon#123",
		permissions: ["depo-tambak-langon"],
	},
	{
		role: "admin-depo-perca",
		email: "admin-depo-perca@gmail.com",
		password: "AdminDepoPerca#123",
		permissions: ["depo-perca"],
	},
];
