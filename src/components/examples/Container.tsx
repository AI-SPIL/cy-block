/* eslint-disable @typescript-eslint/no-explicit-any */
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import { Mesh } from "three";

export const ContainerSize = {
	TWENTY_FOOT: "20ft",
	FORTY_FOOT: "40ft",
} as const;

export type ContainerSize = (typeof ContainerSize)[keyof typeof ContainerSize];

export const ContainerStatus = {
	OCCUPIED: "occupied",
	EMPTY: "empty",
	RESERVED: "reserved",
	MAINTENANCE: "maintenance",
} as const;

export type ContainerStatus = (typeof ContainerStatus)[keyof typeof ContainerStatus];

export const ContainerGrade = {
	A: "A",
	B: "B",
	C: "C",
} as const;

export type ContainerGrade = (typeof ContainerGrade)[keyof typeof ContainerGrade];

export interface ContainerInfo {
	/** Unique container code/identifier */
	code: string;
	/** Vessel and voyage information */
	vesselVoyage?: string;
	/** Container size (20ft or 40ft) */
	size: ContainerSize;
	/** Container grade/quality */
	grade: ContainerGrade;
	/** Container status */
	status: ContainerStatus;
	/** Additional metadata */
	metadata?: {
		weight?: number;
		destination?: string;
		arrivalDate?: string;
		departureDate?: string;
		contents?: string;
		owner?: string;
	};
}

/**
 * Container component props
 */
export interface ContainerProps {
	/** Container position in 3D space [x, y, z] */
	position: [number, number, number];
	/** Container information */
	info: ContainerInfo;
	/** Container color */
	color?: string;
	/** Container rotation in radians [x, y, z] */
	rotation?: [number, number, number];
	/** Whether the container is selected */
	selected?: boolean;
	/** Callback when container is clicked */
	onClick?: (info: ContainerInfo) => void;
	/** Callback when container is hovered */
	onHover?: (info: ContainerInfo | null) => void;
	/** Whether to show tooltip on hover */
	showTooltip?: boolean;
	/** Custom tooltip content renderer */
	renderTooltip?: (info: ContainerInfo) => React.ReactNode;
}

/**
 * Enhanced tooltip component matching the reference image design
 * Fixed overlapping issues with proper positioning and cleaner layout
 */
const ContainerTooltip: React.FC<{ info: ContainerInfo; color: string }> = ({ info, color }) => {
	const getStatusColor = (status: ContainerStatus) => {
		switch (status) {
			case ContainerStatus.OCCUPIED:
				return "#00ff88"; // Bright green like in reference
			case ContainerStatus.EMPTY:
				return "#ffaa00";
			case ContainerStatus.RESERVED:
				return "#0088ff";
			case ContainerStatus.MAINTENANCE:
				return "#ff4444";
			default:
				return "#666";
		}
	};

	const getSizeDisplay = (size: ContainerSize) => {
		return size === ContainerSize.FORTY_FOOT ? "40 feet" : "20 feet";
	};

	return (
		<div
			style={{
				backgroundColor: "rgba(15, 20, 25, 0.98)",
				color: "#ffffff",
				padding: "24px",
				borderRadius: "12px",
				minWidth: "400px",
				maxWidth: "450px",
				fontSize: "16px",
				fontFamily: "system-ui, -apple-system, sans-serif",
				pointerEvents: "none",
				border: `3px solid ${color}`,
				boxShadow: "0 16px 64px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.1)",
				backdropFilter: "blur(16px)",
				maxHeight: "500px",
				overflow: "hidden",
				position: "relative",
			}}
		>
			<div
				style={{
					marginBottom: "20px",
					fontWeight: "600",
					fontSize: "20px",
					color: color,
					borderBottom: `2px solid ${color}40`,
					paddingBottom: "12px",
					letterSpacing: "0.5px",
				}}
			>
				Container Details
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
				{/* Row 1: Container Code and Size */}
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<div style={{ flex: 1 }}>
						<div style={{ color: "#888", fontSize: "14px", fontWeight: "500", marginBottom: "6px" }}>CONTAINER CODE</div>
						<div style={{ fontWeight: "600", color: "#ffffff", fontSize: "18px" }}>{info.code}</div>
					</div>
					<div style={{ flex: 1, textAlign: "right" }}>
						<div style={{ color: "#888", fontSize: "14px", fontWeight: "500", marginBottom: "6px" }}>SIZE</div>
						<div style={{ fontWeight: "600", color: "#ffffff", fontSize: "18px" }}>{getSizeDisplay(info.size)}</div>
					</div>
				</div>

				{/* Row 2: Grade and Status */}
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<div style={{ flex: 1 }}>
						<div style={{ color: "#888", fontSize: "14px", fontWeight: "500", marginBottom: "6px" }}>GRADE</div>
						<div style={{ fontWeight: "600", color: "#ffffff", fontSize: "18px" }}>Grade {info.grade}</div>
					</div>
					<div style={{ flex: 1, textAlign: "right" }}>
						<div style={{ color: "#888", fontSize: "14px", fontWeight: "500", marginBottom: "6px" }}>STATUS</div>
						<div
							style={{
								fontWeight: "600",
								fontSize: "18px",
								color: getStatusColor(info.status),
								textTransform: "capitalize",
							}}
						>
							{info.status}
						</div>
					</div>
				</div>

				{/* Vessel/Voyage */}
				{info.vesselVoyage && (
					<div>
						<div style={{ color: "#888", fontSize: "14px", fontWeight: "500", marginBottom: "6px" }}>VESSEL/VOYAGE</div>
						<div style={{ fontWeight: "600", color: "#ffffff", fontSize: "16px" }}>{info.vesselVoyage}</div>
					</div>
				)}

				{/* Additional info in compact format */}
				{info.metadata && (
					<div style={{ paddingTop: "16px", borderTop: "1px solid #333" }}>
						{info.metadata.weight && (
							<div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
								<span style={{ color: "#888", fontSize: "14px" }}>Weight:</span>
								<span style={{ color: "#ffffff", fontWeight: "500", fontSize: "16px" }}>{info.metadata.weight} tons</span>
							</div>
						)}
						{info.metadata.destination && (
							<div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
								<span style={{ color: "#888", fontSize: "14px" }}>Destination:</span>
								<span style={{ color: "#ffffff", fontWeight: "500", fontSize: "16px" }}>{info.metadata.destination}</span>
							</div>
						)}
						{info.metadata.contents && (
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<span style={{ color: "#888", fontSize: "14px" }}>Contents:</span>
								<span style={{ color: "#ffffff", fontWeight: "500", fontSize: "16px" }}>{info.metadata.contents}</span>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export function Container({ position, info, color = "#64b5f6", rotation = [0, 0, 0], selected = false, onClick, onHover, showTooltip = true, renderTooltip }: ContainerProps) {
	const [hovered, setHovered] = useState(false);
	const meshRef = useRef<Mesh>(null);

	// Get container dimensions based on size
	const getDimensions = (size: ContainerSize): [number, number, number] => {
		return size === ContainerSize.FORTY_FOOT ? [2, 1, 1] : [1, 1, 1];
	};

	const dimensions = getDimensions(info.size);

	// Subtle animation for interactivity
	useFrame(() => {
		if (meshRef.current) {
			const targetScale = hovered || selected ? 1.05 : 1;
			meshRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale } as any, 0.1);
		}
	});

	const handlePointerEnter = () => {
		setHovered(true);
		onHover?.(info);
	};

	const handlePointerLeave = () => {
		setHovered(false);
		onHover?.(null);
	};

	const handleClick = () => {
		onClick?.(info);
	};

	// Skip rendering for empty containers
	if (info.status === ContainerStatus.EMPTY) {
		return null;
	}

	return (
		<group position={position} rotation={rotation}>
			{/* Main container mesh */}
			<mesh ref={meshRef} onClick={handleClick} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}>
				<boxGeometry args={dimensions} />
				<meshStandardMaterial
					color={hovered || selected ? "#ffffff" : color}
					transparent
					opacity={hovered ? 0.95 : 1.0}
					metalness={0.2}
					roughness={0.4}
					emissive={hovered ? color : "#000000"}
					emissiveIntensity={hovered ? 0.1 : 0}
				/>
			</mesh>

			{/* Selection/Hover border */}
			{(hovered || selected) && (
				<mesh position={[0, 0, 0]}>
					<boxGeometry args={[dimensions[0] + 0.05, dimensions[1] + 0.05, dimensions[2] + 0.05]} />
					<meshBasicMaterial color={selected ? "#ffeb3b" : color} wireframe transparent opacity={0.8} />
				</mesh>
			)}

			{/* Enhanced tooltip with consistent size regardless of distance */}
			{hovered && showTooltip && (
				<Html
					position={[0, dimensions[1] + 2, 0]}
					style={{
						transform: "translate(-50%, -100%)",
						pointerEvents: "none",
						zIndex: 999999,
					}}
					occlude={false}
					center
					distanceFactor={1}
					sprite
					portal={{ current: document.body }}
				>
					{renderTooltip ? renderTooltip(info) : <ContainerTooltip info={info} color={color} />}
				</Html>
			)}
		</group>
	);
}

/**
 * Empty Container Slot component - shows white border for empty positions
 */
export interface EmptySlotProps {
	/** Container position in 3D space [x, y, z] */
	position: [number, number, number];
	/** Container size for the empty slot */
	size: ContainerSize;
	/** Whether the slot is selected */
	selected?: boolean;
	/** Callback when slot is clicked */
	onClick?: () => void;
}

export const EmptySlot: React.FC<EmptySlotProps> = ({ position, size, selected = false, onClick }) => {
	const [hovered, setHovered] = useState(false);

	// Get container dimensions based on size
	const getDimensions = (size: ContainerSize): [number, number, number] => {
		return size === ContainerSize.FORTY_FOOT ? [2, 1, 1] : [1, 1, 1];
	};

	const dimensions = getDimensions(size);

	const handlePointerEnter = () => {
		setHovered(true);
	};

	const handlePointerLeave = () => {
		setHovered(false);
	};

	const handleClick = () => {
		onClick?.();
	};

	return (
		<group position={position}>
			{/* Empty slot wireframe */}
			<mesh onClick={handleClick} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}>
				<boxGeometry args={dimensions} />
				<meshBasicMaterial color={hovered || selected ? "#ffffff" : "#ffffff"} wireframe transparent opacity={hovered || selected ? 0.8 : 0.4} />
			</mesh>

			{/* Selection indicator */}
			{selected && (
				<mesh position={[0, 0, 0]}>
					<boxGeometry args={[dimensions[0] + 0.1, dimensions[1] + 0.1, dimensions[2] + 0.1]} />
					<meshBasicMaterial color="#ffeb3b" wireframe transparent opacity={0.6} />
				</mesh>
			)}
		</group>
	);
};

/**
 * Ground Grid component - shows white border grid on the ground for empty positions
 */
export interface GroundGridProps {
	/** Grid position on ground [x, y, z] */
	position: [number, number, number];
	/** Size of the grid area */
	size: ContainerSize;
	/** Whether the grid is selected */
	selected?: boolean;
	/** Rotation angle in radians (optional, for tilted grids) */
	rotation?: number;
}

export const GroundGrid: React.FC<GroundGridProps> = ({ position, size, selected = false, rotation = 0 }) => {
	const [hovered, setHovered] = useState(false);

	// Get grid dimensions based on container size
	const getDimensions = (size: ContainerSize): [number, number] => {
		return size === ContainerSize.FORTY_FOOT ? [2, 1] : [1, 1];
	};

	const [width, depth] = getDimensions(size);

	return (
		<group position={position} rotation={[0, rotation, 0]}>
			{/* Ground grid outline - only outer border */}
			<group onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
				{/* Create border lines manually to avoid diagonal lines */}
				{/* Top border */}
				<mesh position={[0, 0.01, -depth / 2]} rotation={[-Math.PI / 2, 0, 0]}>
					<planeGeometry args={[width, 0.05]} />
					<meshBasicMaterial color="#ffffff" transparent opacity={hovered || selected ? 0.9 : 0.6} />
				</mesh>

				{/* Bottom border */}
				<mesh position={[0, 0.01, depth / 2]} rotation={[-Math.PI / 2, 0, 0]}>
					<planeGeometry args={[width, 0.05]} />
					<meshBasicMaterial color="#ffffff" transparent opacity={hovered || selected ? 0.9 : 0.6} />
				</mesh>

				{/* Left border */}
				<mesh position={[-width / 2, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
					<planeGeometry args={[0.05, depth]} />
					<meshBasicMaterial color="#ffffff" transparent opacity={hovered || selected ? 0.9 : 0.6} />
				</mesh>

				{/* Right border */}
				<mesh position={[width / 2, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
					<planeGeometry args={[0.05, depth]} />
					<meshBasicMaterial color="#ffffff" transparent opacity={hovered || selected ? 0.9 : 0.6} />
				</mesh>
			</group>
		</group>
	);
};

export default Container;
