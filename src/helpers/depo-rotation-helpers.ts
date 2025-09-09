export interface RotationAdjustmentParams {
	depoName?: string;
	blockName?: string;
	blockOrientation?: "horizontal" | "vertical";
	isBlockRotated?: boolean;
	baseRotation: readonly [number, number, number];
}

// Rotation mappings for each block in BAYUR depo
const BAYUR_BLOCK_ROTATIONS: Record<string, number> = {
	A: Math.PI / 6,     // 30 degrees
	B: Math.PI / 3,     // 45 degrees
	C: Math.PI / 3,     // 60 degrees
	D: Math.PI / 2,     // 90 degrees
	E: 2 * Math.PI / 3, // 120 degrees
	F: 3 * Math.PI / 4, // 135 degrees
	G: 5 * Math.PI / 6, // 150 degrees
	H: Math.PI,         // 180 degrees
	I: 7 * Math.PI / 6, // 210 degrees
	J: 5 * Math.PI / 4, // 225 degrees
	K: 4 * Math.PI / 3, // 240 degrees
	L: 3 * Math.PI / 2, // 270 degrees
	M: 5 * Math.PI / 3, // 300 degrees
	N: Math.PI / 4.3, // 330 degrees
	O: Math.PI / 4.3,     // 22.5 degrees
	P: 5 * Math.PI / 2, // 67.5 degrees
	Q: 5 * Math.PI / 2, // 112.5 degrees
	R: Math.PI / 4.3, // 157.5 degrees
	S: Math.PI / 4.3, // 202.5 degrees
	T: Math.PI / 4.3, // 247.5 degrees
	U: Math.PI / 3.6, // 292.5 degrees
	V: Math.PI / 2, // 90 degrees
	W: Math.PI / 10,    // 15 degrees
	X: Math.PI / 3.6,     // 36 degrees
};

export function getAdjustedRotation(params: RotationAdjustmentParams): readonly [number, number, number] {
	const { depoName, blockName, blockOrientation, isBlockRotated, baseRotation } = params;

	// Special handling for depo-japfa: add 90 degrees for rotated vertical blocks
	if (depoName === "JAPFA" && isBlockRotated && blockOrientation === "vertical") {
		return [
			baseRotation[0],
			baseRotation[1] + Math.PI / 2, // Add 90 degrees (π/2 radians)
			baseRotation[2],
		] as const;
	}

	// Special handling for depo-bayur: different rotation for each block
	if (depoName === "BAYUR" && isBlockRotated && blockName) {
		const blockRotation = BAYUR_BLOCK_ROTATIONS[blockName];
		if (blockRotation !== undefined) {
			return [
				baseRotation[0],
				baseRotation[1] + blockRotation,
				baseRotation[2],
			] as const;
		}
		// Fallback to original rotation if block not found
		return [
			baseRotation[0],
			baseRotation[1] + Math.PI / 5, // Original rotation
			baseRotation[2],
		] as const;
	}

	return baseRotation;
}

export function shouldApplyRotation(rotationRad: number, tolerance = 10): boolean {
	const degrees = Math.abs((rotationRad * 180) / Math.PI) % 360;
	const cardinalAngles = [0, 90, 180, 270];

	return !cardinalAngles.some((cardinal) =>
		Math.abs(degrees - cardinal) <= tolerance ||
		Math.abs(degrees - (cardinal + 360)) <= tolerance
	);
}
