export interface RotationAdjustmentParams {
	depoName?: string;
	blockOrientation?: "horizontal" | "vertical";
	isBlockRotated?: boolean;
	baseRotation: readonly [number, number, number];
}

export function getAdjustedRotation(params: RotationAdjustmentParams): readonly [number, number, number] {
	const { depoName, blockOrientation, isBlockRotated, baseRotation } = params;

	// Special handling for depo-japfa: add 90 degrees for rotated vertical blocks
	if (depoName === "JAPFA" && isBlockRotated && blockOrientation === "vertical") {
		return [
			baseRotation[0],
			baseRotation[1] + Math.PI / 2, // Add 90 degrees (π/2 radians)
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
