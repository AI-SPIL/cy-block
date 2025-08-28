import { useState } from "react";

export interface PositionedContainer {
	position: [number, number, number];
	meshSize: [number, number, number];
	rotation: [number, number, number];
	color: string;
	name: string;
}

export function Container({
	container,
	selected,
	onSelect,
}: {
	container: PositionedContainer;
	selected: boolean;
	onSelect: (name: string) => void;
}) {
	const [hovered, setHovered] = useState(false);

	// Only rotate if not near cardinal directions (0°, 90°, 180°, 270°)
	const shouldApplyRotation = (rotationRad: number, tolerance = 10) => {
		const degrees = Math.abs((rotationRad * 180) / Math.PI) % 360;
		const cardinalAngles = [0, 90, 180, 270];

		return !cardinalAngles.some(
			(cardinal) =>
				Math.abs(degrees - cardinal) <= tolerance ||
				Math.abs(degrees - (cardinal + 360)) <= tolerance
		);
	};

	const rotationToApply = [
		shouldApplyRotation(container.rotation[0]) ? container.rotation[0] : 0,
		shouldApplyRotation(container.rotation[1]) ? container.rotation[1] : 0,
		shouldApplyRotation(container.rotation[2]) ? container.rotation[2] : 0,
	] as const;

	// Determine if any rotation is actually being applied
	const isRotated = rotationToApply.some((r) => Math.abs(r) > 0.01);

	// Adjust container dimensions based on rotation
	const containerDimensions = isRotated
		? // Default vertical container size: 2.1 x 2.0 x 4.9
		  ([2.1, 2.0, 4.9] as const)
		: // For aligned containers, use exact mesh dimensions
		  ([
				container.meshSize[0],
				container.meshSize[1],
				container.meshSize[2],
		  ] as const);

	// Debug logging for specific containers
	if (container.name === "D024" || container.name.includes("A")) {
		const originalDegrees = container.rotation.map((r) =>
			((r * 180) / Math.PI).toFixed(1)
		);
		const finalDegrees = rotationToApply.map((r) =>
			((r * 180) / Math.PI).toFixed(1)
		);
		console.log(`${container.name} rotation:`, {
			original: originalDegrees,
			applied: finalDegrees,
			isRotated: isRotated,
			dimensions: containerDimensions,
			shouldRotateX: shouldApplyRotation(container.rotation[0]),
			shouldRotateY: shouldApplyRotation(container.rotation[1]),
			shouldRotateZ: shouldApplyRotation(container.rotation[2]),
		});
	}

	const handlePointerEnter = () => {
		setHovered(true);
	};

	const handlePointerLeave = () => {
		setHovered(false);
	};

	const handleClick = () => {
		onSelect(container.name);
	};

	return (
		<group position={container.position}>
			{/* Apply rotation only if not near cardinal directions */}
			<group rotation={rotationToApply}>
				<mesh
					onClick={handleClick}
					onPointerEnter={handlePointerEnter}
					onPointerLeave={handlePointerLeave}
					castShadow
					receiveShadow
				>
					{/* Use adaptive dimensions based on rotation */}
					<boxGeometry args={containerDimensions} />
					<meshStandardMaterial
						color={hovered || selected ? "#ffffff" : container.color}
						transparent
						opacity={hovered ? 0.95 : selected ? 0.8 : 1.0}
						metalness={0.2}
						roughness={0.4}
						emissive={hovered ? container.color : "#000000"}
						emissiveIntensity={hovered ? 0.1 : 0}
					/>
				</mesh>

				{(hovered || selected) && (
					<mesh position={[0, 0, 0]}>
						{/* Wireframe uses adaptive dimensions */}
						<boxGeometry
							args={[
								containerDimensions[0] + 0.1,
								containerDimensions[1] + 0.1,
								containerDimensions[2] + 0.1,
							]}
						/>
						<meshBasicMaterial
							color={container.color}
							wireframe
							transparent
							opacity={0.8}
						/>
					</mesh>
				)}
			</group>{" "}
			{/* Smart rotation group */}
		</group>
	);
}
