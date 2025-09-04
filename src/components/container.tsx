import { useState } from "react";
import {
	getAdjustedRotation,
	shouldApplyRotation,
} from "../helpers/depo-rotation-helpers";

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
	blockOrientation?: "horizontal" | "vertical";
	isBlockRotated?: boolean;
}

export function Container({
	container,
	defaultSize20Vertical,
	defaultSize20Horizontal,
	defaultSize40Horizontal,
	defaultSize40Vertical,
	selected,
	onSelect,
	depoName,
}: {
	container: PositionedContainer;
	defaultSize20Vertical: [number, number, number];
	defaultSize20Horizontal: [number, number, number];
	defaultSize40Horizontal: [number, number, number];
	defaultSize40Vertical: [number, number, number];
	selected: boolean;
	onSelect: (name: string) => void;
	depoName?: string;
}) {
	const [hovered, setHovered] = useState(false);

	const rotationToApply = [
		shouldApplyRotation(container.rotation[0]) ? container.rotation[0] : 0,
		shouldApplyRotation(container.rotation[1]) ? container.rotation[1] : 0,
		shouldApplyRotation(container.rotation[2]) ? container.rotation[2] : 0,
	] as const;

	// Apply depo-specific rotation adjustments using the helper function
	const finalRotation = getAdjustedRotation({
		depoName,
		blockOrientation: container.blockOrientation,
		isBlockRotated: container.isBlockRotated,
		baseRotation: rotationToApply,
	});

	// Determine if any rotation is actually being applied
	const isRotated = finalRotation.some((r) => Math.abs(r) > 0.01);

	// Get default dimensions based on container size and rotation
	const getDefaultDimensions = (): [number, number, number] => {
		if (container.size === "20") {
			// For 20ft containers, determine orientation based on mesh dimensions AND rotation
			const meshWidth = container.meshSize[0];
			const meshDepth = container.meshSize[2];
			const isHorizontalMesh = meshWidth > meshDepth;

			// If the block is rotated, we need to consider the rotation when choosing orientation
			if (isRotated) {
				// For rotated blocks, match the mesh orientation
				return isHorizontalMesh
					? defaultSize20Horizontal
					: defaultSize20Vertical;
			} else {
				// For non-rotated blocks, use mesh dimensions to determine orientation
				return isHorizontalMesh
					? defaultSize20Horizontal
					: defaultSize20Vertical;
			}
		} else if (container.size === "40") {
			// For 40ft containers
			const meshWidth = container.meshSize[0];
			const meshDepth = container.meshSize[2];
			const isVerticalMesh = meshDepth > meshWidth;

			let selectedDimensions;
			if (isRotated) {
				selectedDimensions = isVerticalMesh
					? defaultSize40Vertical
					: defaultSize40Horizontal;
			} else {
				selectedDimensions = isVerticalMesh
					? defaultSize40Vertical
					: defaultSize40Horizontal;
			}

			return selectedDimensions;
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
				getDefaultDimensions()[1],
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
			{/* Apply rotation including special depo-japfa adjustment */}
			<group rotation={finalRotation}>
				{/* Position the container so its bottom sits on the surface */}
				<group position={[0, containerDimensions[1] / 2, 0]}>
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
				</group>
			</group>{" "}
			{/* Smart rotation group */}
		</group>
	);
}
