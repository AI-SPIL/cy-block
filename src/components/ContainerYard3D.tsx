import { Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import data from "../../public/data.json";
import "./container-yard.css";

const blockColors = {
	A: "#e57373",
	B: "#64b5f6",
	C: "#81c784",
	D: "#ffd54f",
	E: "#ba68c8",
	F: "#4db6ac",
};

type Slot = {
	row: number;
	column: number;
	tier: number;
	status: string;
	kode_kontainer?: string | null;
	vessel_voy?: string | null;
	size?: string | null;
	grade?: string | null;
};

interface ContainerBoxProps {
	slot: Slot;
	block: keyof typeof blockColors;
}

// Tooltip component for container details
function ContainerTooltip({ slot, block }: { slot: Slot; block: keyof typeof blockColors }) {
	return (
		<div
			style={{
				backgroundColor: "rgba(0, 0, 0, 0.9)",
				color: "white",
				padding: "12px",
				borderRadius: "8px",
				minWidth: "200px",
				fontSize: "12px",
				fontFamily: "Arial, sans-serif",
				pointerEvents: "none",
				border: `2px solid ${blockColors[block]}`,
				boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
			}}
		>
			<div style={{ marginBottom: "8px", fontWeight: "bold", fontSize: "14px", color: blockColors[block] }}>Block {block} - Container Details</div>
			<div>
				<strong>Container Code:</strong> {slot.kode_kontainer || "N/A"}
			</div>
			<div>
				<strong>Position:</strong> Row {slot.row}, Column {slot.column}, Tier {slot.tier}
			</div>
			<div>
				<strong>Vessel/Voyage:</strong> {slot.vessel_voy || "N/A"}
			</div>
			<div>
				<strong>Size:</strong> {slot.size || "N/A"}
			</div>
			<div>
				<strong>Grade:</strong> {slot.grade || "N/A"}
			</div>
			<div>
				<strong>Status:</strong>{" "}
				<span
					style={{
						color: slot.status === "occupied" ? "#4caf50" : "#ff9800",
						fontWeight: "bold",
					}}
				>
					{slot.status}
				</span>
			</div>
		</div>
	);
}

function ContainerBox({ slot, block }: ContainerBoxProps) {
	const [hovered, setHovered] = useState(false);

	if (slot.status !== "occupied") return null;

	const size: [number, number, number] = slot.size === "40ft" ? [2, 1, 1] : [1, 1, 1];
	const x = (slot.column - 2) * 2 + (block.charCodeAt(0) - 65) * 7;
	const y = slot.tier - 1;
	const z = (slot.row - 2) * 2;

	return (
		<group>
			<mesh position={[x, y, z]} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
				<boxGeometry args={size} />
				<meshStandardMaterial color={hovered ? "#ffffff" : blockColors[block]} transparent={hovered} opacity={hovered ? 0.8 : 1.0} />
				{/* Add border when hovered */}
				{hovered && (
					<mesh position={[0, 0, 0]}>
						<boxGeometry args={[size[0] + 0.1, size[1] + 0.1, size[2] + 0.1]} />
						<meshBasicMaterial color={blockColors[block]} wireframe={true} transparent={true} opacity={0.8} />
					</mesh>
				)}
				{/* Tooltip */}
				{hovered && (
					<Html position={[0, size[1] + 1, 0]} center occlude="blending">
						<ContainerTooltip slot={slot} block={block} />
					</Html>
				)}
			</mesh>
		</group>
	);
}

export default function ContainerYard3D() {
	const yard = data[0];
	// Center target: blok A pojok kiri atas (row 1, column 1, tier 1) dan blok F pojok kanan bawah (row 3, column 3, tier 3)
	// Center canvas di tengah area blok
	const centerX = (0 + 5 * 7) / 2; // blok A (0) ke blok F (5), 7 jarak antar blok
	const centerZ = 0; // rata-rata row
	const centerY = 2; // rata-rata tier
	return (
		<Canvas camera={{ position: [centerX, 20, 25], fov: 50 }} style={{ width: "100vw", height: "100vh", background: "#e0e7ef" }}>
			<ambientLight intensity={0.7} />
			<directionalLight position={[30, 40, 20]} intensity={0.8} />
			{/* Ground plane as foreground */}
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[centerX, -0.5, centerZ]} receiveShadow>
				<planeGeometry args={[60, 60]} />
				<meshStandardMaterial color="#b0bec5" />
			</mesh>
			<Suspense fallback={null}>
				{yard.blocks.map((block) => block.slots.map((slot, idx) => <ContainerBox key={block.block_name + idx} slot={slot} block={block.block_name as keyof typeof blockColors} />))}
				<OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minPolarAngle={0} maxPolarAngle={Math.PI} target={[centerX, centerY, centerZ]} zoomSpeed={1} />
			</Suspense>
		</Canvas>
	);
}
