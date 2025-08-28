import { useState } from "react";

export interface PositionedContainer {
	position: [number, number, number];
	meshSize: [number, number, number];
	rotation: [number, number, number];
	color: string;
	name: string;
	containerCode?: string;
	size?: string;
	grade?: string | null;
	row?: number;
	column?: number;
	tier?: number;
	blockName?: string;
}

export function Container({
	container,
	defaultSize20Vertical = [2.1, 2.0, 4.9],
	defaultSize20Horizontal = [4.9, 2.0, 2.1],
	defaultSize40Horizontal = [10.8, 2.0, 2.2],
	defaultSize40Vertical = [2.2, 2.0, 10.8],
	selected,
	onSelect,
}: {
	container: PositionedContainer;
	defaultSize20Vertical?: [number, number, number];
	defaultSize20Horizontal?: [number, number, number];
	defaultSize40Horizontal?: [number, number, number];
	defaultSize40Vertical?: [number, number, number];
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

	// Get default dimensions based on container size and rotation
	const getDefaultDimensions = (): [number, number, number] => {
		if (container.size === "20") {
			// For 20ft containers, determine orientation based on mesh dimensions
			// If mesh is wider than it is deep, use horizontal orientation
			const meshWidth = container.meshSize[0];
			const meshDepth = container.meshSize[2];
			const isHorizontalMesh = meshWidth > meshDepth;

			return isHorizontalMesh ? defaultSize20Horizontal : defaultSize20Vertical;
		} else if (container.size === "40") {
			// For 40ft containers, determine orientation based on mesh dimensions
			// If mesh is deeper than it is wide, use vertical orientation
			const meshWidth = container.meshSize[0];
			const meshDepth = container.meshSize[2];
			const isVerticalMesh = meshDepth > meshWidth;

			return isVerticalMesh ? defaultSize40Vertical : defaultSize40Horizontal;
		}
		// Fallback to 20ft vertical if size is not specified
		return defaultSize20Vertical;
	};

	// Adjust container dimensions based on rotation
	const containerDimensions = isRotated
		? getDefaultDimensions()
		: // For aligned containers, use exact mesh dimensions
		  ([
				container.meshSize[0],
				container.meshSize[1],
				container.meshSize[2],
		  ] as const);

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
