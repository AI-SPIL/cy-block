import { Edges, Text } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useState, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
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
	id?: string;
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

const darkenColor = (color: string, factor: number = 0.3): string => {
	const hex = color.replace("#", "");
	const r = parseInt(hex.substr(0, 2), 16);
	const g = parseInt(hex.substr(2, 2), 16);
	const b = parseInt(hex.substr(4, 2), 16);

	const newR = Math.round(r * (1 - factor));
	const newG = Math.round(g * (1 - factor));
	const newB = Math.round(b * (1 - factor));

	return `#${newR.toString(16).padStart(2, "0")}${newG
		.toString(16)
		.padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
};

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
	const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

	// Siapkan base colors
	const baseColor = useMemo(
		() => new THREE.Color(container.color),
		[container.color]
	);
	const darkColor = useMemo(
		() => new THREE.Color(darkenColor(container.color, 0.4)),
		[container.color]
	);
	const lightColor = useMemo(
		() => new THREE.Color(darkenColor(container.color, 0.2)),
		[container.color]
	);

	// Animasi pulse glow saat hover/selected
	useFrame(({ clock }) => {
		if (!materialRef.current) return;

		const pulse = (Math.sin(clock.elapsedTime * 3) + 1) / 2; // 0..1

		if (hovered || selected) {
			// Warna berdenyut antara gelap ↔ terang
			materialRef.current.color.lerpColors(darkColor, lightColor, pulse);

			// Emissive ikut hidup
			materialRef.current.emissive.copy(lightColor);
			materialRef.current.emissiveIntensity = 0.1 + pulse * 0.2;
		} else if (isDragging || container.isDragging) {
			materialRef.current.color.set("#ffff00");
			materialRef.current.emissive.set("#ffff00");
			materialRef.current.emissiveIntensity = 0.3;
		} else if (container.isDropTarget) {
			materialRef.current.color.set("#00ff00");
			materialRef.current.emissive.set("#00ff00");
			materialRef.current.emissiveIntensity = 0.2;
		} else {
			materialRef.current.color.copy(baseColor);
			materialRef.current.emissive.set("#000000");
			materialRef.current.emissiveIntensity = 0;
		}
	});

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

	const handlePointerEnter = (event: ThreeEvent<PointerEvent>) => {
		event.stopPropagation(); // Prevent event bubbling to containers behind
		setHovered(true);
	};

	const handlePointerLeave = (event: ThreeEvent<PointerEvent>) => {
		event.stopPropagation(); // Prevent event bubbling to containers behind
		setHovered(false);
	};

	const handleClick = (event: ThreeEvent<PointerEvent>) => {
		event.stopPropagation(); // Prevent clicking containers behind
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
		event.stopPropagation(); // Prevent event bubbling to containers behind
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
								  }
								: handleClick
						}
						onPointerEnter={handlePointerEnter}
						onPointerLeave={handlePointerLeave}
						onPointerDown={onDragStart ? handleDragStart : undefined}
						onPointerMove={isDragging ? handlePointerMove : undefined}
						onPointerUp={onDragEnd ? handleDragEnd : undefined}
					>
						{/* Use adaptive dimensions based on rotation */}
						<boxGeometry args={containerDimensions} />
						<meshStandardMaterial
							ref={materialRef}
							transparent={false}
							opacity={1.0}
						/>
						{/* White border edges */}
						<Edges color="white" linewidth={1} />
					</mesh>

					{/* Container code text on right side */}
					{container.containerCode && (
						<>
							{/* Right side text */}
							<group position={[containerDimensions[0] / 2 + 0.01, 0, 0]}>
								<Text
									color="white"
									fontSize={0.005}
									maxWidth={containerDimensions[2]}
									lineHeight={1}
									letterSpacing={0.02}
									textAlign="center"
									font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
									anchorX="left"
									anchorY="middle"
									rotation={[0, Math.PI / 2, 0]} // Rotate to face right
								>
									{container.containerCode}
									<meshBasicMaterial color="white" />
								</Text>
								{/* Black background for right side */}
								<mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
									<planeGeometry args={[containerDimensions[2] * 0.8, 0.8]} />
									<meshBasicMaterial color="black" transparent opacity={0.8} />
								</mesh>
							</group>

							{/* Left side text */}
							<group position={[-containerDimensions[0] / 2 - 0.01, 0, 0]}>
								<Text
									color="white"
									fontSize={0.005}
									maxWidth={containerDimensions[2]}
									lineHeight={1}
									letterSpacing={0.02}
									textAlign="center"
									font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
									anchorX="right"
									anchorY="middle"
									rotation={[0, -Math.PI / 2, 0]} // Rotate to face left
								>
									{container.containerCode}
									<meshBasicMaterial color="white" />
								</Text>
								{/* Black background for left side */}
								<mesh position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
									<planeGeometry args={[containerDimensions[2] * 0.8, 0.8]} />
									<meshBasicMaterial color="black" transparent opacity={0.8} />
								</mesh>
							</group>
						</>
					)}
				</group>
			</group>
		</group>
	);
}
