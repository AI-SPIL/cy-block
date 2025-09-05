import { useState } from "react";
import {
	getAdjustedRotation,
	shouldApplyRotation,
} from "../helpers/depo-rotation-helpers";
import type { ThreeEvent } from "@react-three/fiber";

export interface PositionedContainer {
	position: [number, number, number];
	meshSize: [number, number, number];
	rotation: [number, number, number];
	color: string;
	name: string;
	containerCode?: string;
	size?: string;
	grade?: string | null;
	status?: string;
	row?: number;
	column?: number;
	tier?: number;
	blockName?: string;
	blockOrientation?: "horizontal" | "vertical";
	isBlockRotated?: boolean;
	isDragging?: boolean;
	isDropTarget?: boolean;
}

export function Container({
	container,
	defaultSize20Vertical,
	defaultSize20Horizontal,
	defaultSize40Horizontal,
	defaultSize40Vertical,
	selected,
	onSelect,
	onDragStart,
	onDragEnd,
	onDrop,
	onDragMove,
	depoName,
}: {
	container: PositionedContainer;
	defaultSize20Vertical: [number, number, number];
	defaultSize20Horizontal: [number, number, number];
	defaultSize40Horizontal: [number, number, number];
	defaultSize40Vertical: [number, number, number];
	selected: boolean;
	onSelect: (name: string) => void;
	onDragStart?: (container: PositionedContainer) => void;
	onDragEnd?: () => void;
	onDrop?: (
		targetContainer: PositionedContainer,
		draggedContainer: PositionedContainer
	) => void;
	onDragMove?: (position: [number, number, number]) => void;
	depoName?: string;
}) {
	const [hovered, setHovered] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const rotationToApply = [
		shouldApplyRotation(container.rotation[0]) ? container.rotation[0] : 0,
		shouldApplyRotation(container.rotation[1]) ? container.rotation[1] : 0,
		shouldApplyRotation(container.rotation[2]) ? container.rotation[2] : 0,
	] as const;

	// Apply depo-specific rotation adjustments using the helper function
	const finalRotation = getAdjustedRotation({
		depoName,
		blockName: container.blockName,
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
		if (!isDragging && !container.isDragging) {
			onSelect(container.name);
		}
	};

	const handleDragStart = (event: ThreeEvent<PointerEvent>) => {
		if (!onDragStart) return;
		event.stopPropagation();
		setIsDragging(true);
		onDragStart(container);
	};

	const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
		if (isDragging && onDragMove) {
			// Calculate new position based on pointer movement
			const newPosition: [number, number, number] = [
				event.point.x,
				event.point.y + 2, // Keep it elevated during drag
				event.point.z,
			];
			onDragMove(newPosition);
		}
	};

	const handleDragEnd = (event: ThreeEvent<PointerEvent>) => {
		if (!onDragEnd) return;
		event.stopPropagation();
		setIsDragging(false);
		onDragEnd();
	};

	// Calculate final position - elevate when dragging
	const finalPosition: [number, number, number] = container.isDragging
		? [
				container.position[0],
				container.position[1] + 1, // Elevate when dragging
				container.position[2],
		  ]
		: container.position;

	return (
		<group position={finalPosition}>
			{/* Apply rotation including special depo-japfa adjustment */}
			<group rotation={finalRotation}>
				{/* Position the container so its bottom sits on the surface */}
				<group position={[0, containerDimensions[1] / 2, 0]}>
					<mesh
						onClick={
							container.isDropTarget && onDrop
								? (event) => {
										event.stopPropagation();
										// Will trigger drop logic in parent
								  }
								: handleClick
						}
						onPointerEnter={handlePointerEnter}
						onPointerLeave={handlePointerLeave}
						onPointerDown={onDragStart ? handleDragStart : undefined}
						onPointerMove={isDragging ? handlePointerMove : undefined}
						onPointerUp={onDragEnd ? handleDragEnd : undefined}
						castShadow
						receiveShadow
					>
						{/* Use adaptive dimensions based on rotation */}
						<boxGeometry args={containerDimensions} />
						<meshStandardMaterial
							color={
								isDragging
									? "#ffff00" // Yellow when dragging
									: hovered || selected
									? "#ffffff"
									: container.isDragging
									? "#ffff00" // Yellow when being dragged from parent state
									: container.isDropTarget
									? "#00ff00" // Green when valid drop target
									: container.color
							}
							transparent
							opacity={
								isDragging || container.isDragging
									? 0.7 // More transparent when dragging
									: hovered
									? 0.95
									: selected
									? 0.8
									: container.isDropTarget
									? 0.9 // Slightly transparent when drop target
									: 1.0
							}
							metalness={0.2}
							roughness={0.4}
							emissive={
								isDragging || container.isDragging
									? "#ffff00" // Yellow glow when dragging
									: hovered
									? container.color
									: container.isDropTarget
									? "#00ff00" // Green glow when drop target
									: "#000000"
							}
							emissiveIntensity={
								isDragging || container.isDragging
									? 0.3 // Stronger glow when dragging
									: hovered
									? 0.1
									: container.isDropTarget
									? 0.2 // Green glow when drop target
									: 0
							}
						/>
					</mesh>
				</group>
			</group>{" "}
			{/* Smart rotation group */}
		</group>
	);
}
