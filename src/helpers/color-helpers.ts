// Color mapping based on status and grade
export const STATUS_COLORS = {
	MTD: "#ff0000", // Red
	MTA: "#00ff00", // Green
	MTS: "#40e0d0", // Turquoise
	MTB: "#806040", // Brown
	FTL: "#ffa500", // Orange
	STR: "#ffd700", // Yellow
	MNA: "#800080", // Purple
	FXD: "#ff1493", // Deep Pink
	FIT: "#00bfff", // Deep Sky Blue
} as const;

export const GRADE_COLORS = {
	A: "#ff4444", // Light Red
	B: "#44ff44", // Light Green
	C: "#4444ff", // Light Blue
} as const;

export function getContainerColor(
	status: string,
	grade: string | null,
	colorBy: "status" | "grade" = "grade"
): string {
	if (colorBy === "status") {
		return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "#666666";
	} else {
		// Default to grade-based coloring
		if (!grade) return "#666666"; // Gray for null/undefined grades
		return GRADE_COLORS[grade as keyof typeof GRADE_COLORS] || "#666666";
	}
}

export function getStatusColorName(status: string): string {
	const colorNames = {
		MTD: "Red",
		MTA: "Green",
		MTS: "Turquoise",
		MTB: "Brown",
		FTL: "Orange",
		STR: "Yellow",
		MNA: "Purple",
		FXD: "Deep Pink",
		FIT: "Deep Sky Blue",
	};
	return colorNames[status as keyof typeof colorNames] || "Unknown";
}
