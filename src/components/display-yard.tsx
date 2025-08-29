import { depo4Data } from "@/data/depo-4";
import { depoJapfaData } from "@/data/depo-japfa";
import { mappingBayurData } from "@/data/mapping-bayur";
import type { ExampleResponse } from "@/data/types";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { Container, type PositionedContainer } from "./container";
import { Floor } from "./floor";

type DepoType = "JAPFA" | "4" | "BAYUR";

// Default to Horizontal
export interface ContainerDefaultSize {
	size20: [number, number, number];
	size40: [number, number, number];
}

interface DisplayYardProps {
	name: DepoType;
	containerSize: ContainerDefaultSize;
}

const PATH_MAPPING = {
	JAPFA: {
		model: "/cy-block/japfa.glb",
		data: depoJapfaData,
	},
	"4": {
		model: "/cy-block/depo-4.glb",
		data: depo4Data,
	},
	BAYUR: {
		model: "/cy-block/mapping-bayur.glb",
		data: mappingBayurData,
	},
} satisfies Record<DepoType, { model: string; data: ExampleResponse }>;

export default function DisplayYard({ name, containerSize }: DisplayYardProps) {
	const [selectedContainer, setSelectedContainer] = useState<string | null>(null);
	const [containers, setContainers] = useState<PositionedContainer[]>([]);

	const size20Container = containerSize.size20;
	const size40Container = containerSize.size40;

	const defaultSize20Vertical = [size20Container[2], size20Container[1], size20Container[0]] satisfies [number, number, number];
	const defaultSize20Horizontal = size20Container;
	const defaultSize40Vertical = [size40Container[2], size40Container[1], size40Container[0]] satisfies [number, number, number];
	const defaultSize40Horizontal = size40Container;

	const getContainerDimensions = (containerSize: string, meshSize: [number, number, number], rotation: [number, number, number]): [number, number, number] => {
		// Check if the block is rotated (not at cardinal directions)
		const shouldApplyRotation = (rotationRad: number, tolerance = 10) => {
			const degrees = Math.abs((rotationRad * 180) / Math.PI) % 360;
			const cardinalAngles = [0, 90, 180, 270];
			return !cardinalAngles.some((cardinal) => Math.abs(degrees - cardinal) <= tolerance || Math.abs(degrees - (cardinal + 360)) <= tolerance);
		};

		const isRotated = [rotation[0], rotation[1], rotation[2]].some((r) => shouldApplyRotation(r));

		if (containerSize === "20") {
			// For 20ft containers, determine orientation based on mesh dimensions
			const meshWidth = meshSize[0];
			const meshDepth = meshSize[2];
			const isHorizontalMesh = meshWidth > meshDepth;

			// If block is rotated, use standard dimensions, otherwise match mesh orientation
			if (isRotated) {
				return isHorizontalMesh ? defaultSize20Horizontal : defaultSize20Vertical;
			} else {
				return isHorizontalMesh ? defaultSize20Horizontal : defaultSize20Vertical;
			}
		} else if (containerSize === "40") {
			// For 40ft containers, determine orientation based on mesh dimensions
			const meshWidth = meshSize[0];
			const meshDepth = meshSize[2];
			const isVerticalMesh = meshDepth > meshWidth;

			if (isRotated) {
				return isVerticalMesh ? defaultSize40Vertical : defaultSize40Horizontal;
			} else {
				return isVerticalMesh ? defaultSize40Vertical : defaultSize40Horizontal;
			}
		}

		// Fallback: use mesh dimensions with actual mesh height
		return [meshSize[0], meshSize[1], meshSize[2]];
	};

	const handleMeshPositionsReady = (positions: {
		[key: string]: {
			position: [number, number, number];
			size: [number, number, number];
			rotation: [number, number, number];
		};
	}) => {
		const colors = [
			"#ff4444",
			"#44ff44",
			"#4444ff",
			"#ffff44",
			"#ff44ff",
			"#44ffff",
			"#ff8844",
			"#88ff44",
			"#4488ff",
			"#ff4488",
			"#8844ff",
			"#44ff88",
			"#ff6666",
			"#66ff66",
			"#6666ff",
			"#ffff66",
			"#ff66ff",
			"#66ffff",
			"#ffaa44",
			"#aaffaa",
			"#44aaff",
			"#ffaa88",
			"#aa88ff",
			"#88ffaa",
			"#cc4444",
			"#44cc44",
			"#4444cc",
			"#cccc44",
			"#cc44cc",
			"#44cccc",
			"#ff2222",
			"#22ff22",
			"#2222ff",
			"#ffff22",
			"#ff22ff",
			"#22ffff",
			"#dd6644",
			"#66dd44",
			"#4466dd",
			"#dd6688",
			"#6644dd",
			"#44dd66",
			"#ee8844",
			"#88ee44",
			"#4488ee",
			"#ee8888",
			"#8844ee",
			"#44ee88",
		];

		const depoData = PATH_MAPPING[name].data;
		const newContainers: PositionedContainer[] = [];
		let containerIndex = 0;

		depoData.blocks.forEach((block) => {
			block.slots.forEach((slot) => {
				const meshName = `${block.block_name}_${slot.column}_${slot.row}`;

				// Find corresponding mesh position
				const meshData = positions[meshName];
				if (meshData) {
					// Check if the block is rotated (not at cardinal directions)
					const shouldApplyRotation = (rotationRad: number, tolerance = 10) => {
						const degrees = Math.abs((rotationRad * 180) / Math.PI) % 360;
						const cardinalAngles = [0, 90, 180, 270];
						return !cardinalAngles.some((cardinal) => Math.abs(degrees - cardinal) <= tolerance || Math.abs(degrees - (cardinal + 360)) <= tolerance);
					};

					const isBlockRotated = [meshData.rotation[0], meshData.rotation[1], meshData.rotation[2]].some((r) => shouldApplyRotation(r));

					// Determine block orientation based on mesh dimensions
					const meshWidth = meshData.size[0];
					const meshDepth = meshData.size[2];
					const blockOrientation: "horizontal" | "vertical" = meshWidth > meshDepth ? "horizontal" : "vertical";

					// Get container dimensions based on rotation and size
					const containerDimensions = getContainerDimensions(slot.size, meshData.size, meshData.rotation);

					const containerHeight = containerDimensions[1]; // Y size

					// Position container so its bottom sits on the top surface of the block
					// For tier 1: bottom of container = top of block (meshData.position[1] + meshData.size[1] / 2)
					// For higher tiers: stack containers on top of each other
					// Since we now anchor containers at their bottom, we don't add containerHeight / 2
					const yPosition = meshData.position[1] + meshData.size[1] / 2 + (slot.tier - 1) * containerHeight;

					const container: PositionedContainer = {
						position: [meshData.position[0], yPosition, meshData.position[2]],
						meshSize: meshData.size,
						rotation: meshData.rotation,
						color: colors[containerIndex % colors.length],
						name: `${meshName}_T${slot.tier}`,
						containerCode: slot.container_code,
						size: slot.size,
						grade: slot.grade,
						row: slot.row,
						column: slot.column,
						tier: slot.tier,
						blockName: block.block_name,
						blockOrientation: blockOrientation,
						isBlockRotated: isBlockRotated,
					};

					newContainers.push(container);
					containerIndex++;
				} else {
					console.error(`Mesh not found for ${meshName}`);
				}
			});
		});

		setContainers(newContainers);
	};

	const handleContainerClick = (containerName: string) => {
		setSelectedContainer(selectedContainer === containerName ? null : containerName);
	};

	return (
		<div style={{ width: "100vw", height: "100vh", position: "relative" }}>
			<Canvas
				camera={{
					position: [15, 10, 15],
					fov: 60,
				}}
				style={{
					width: "100%",
					height: "100%",
					background: "linear-gradient(to bottom, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
				}}
				shadows
			>
				{/* Lighting */}
				<ambientLight intensity={0.6} />
				<directionalLight
					position={[10, 15, 5]}
					intensity={0.8}
					castShadow
					shadow-mapSize={[2048, 2048]}
					shadow-camera-far={50}
					shadow-camera-left={-20}
					shadow-camera-right={20}
					shadow-camera-top={20}
					shadow-camera-bottom={-20}
				/>

				{/* Ground plane */}
				<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
					<planeGeometry args={[100, 100]} />
					<meshStandardMaterial color="#1a1a1a" transparent opacity={0.8} roughness={0.8} metalness={0.1} />
				</mesh>

				{/* Load and display Depo 4 GLB model */}
				<Floor path={PATH_MAPPING[name].model} onMeshPositionsReady={handleMeshPositionsReady} />

				{/* Render custom containers at mesh centers */}
				{containers.map((containerData, index) => (
					<Container
						key={`container-${index}`}
						container={containerData}
						defaultSize20Vertical={defaultSize20Vertical}
						defaultSize20Horizontal={defaultSize20Horizontal}
						defaultSize40Horizontal={defaultSize40Horizontal}
						defaultSize40Vertical={defaultSize40Vertical}
						selected={selectedContainer === containerData.name}
						onSelect={handleContainerClick}
						depoName={name}
					/>
				))}

				{/* Camera Controls */}
				<OrbitControls
					enablePan={true}
					enableZoom={true}
					enableRotate={true}
					minPolarAngle={0}
					maxPolarAngle={Math.PI / 2.2}
					target={[0, 2, 0]}
					zoomSpeed={0.8}
					panSpeed={0.8}
					rotateSpeed={0.5}
				/>
			</Canvas>

			{/* Info Panel */}
			{selectedContainer && (
				<div
					style={{
						position: "absolute",
						top: "20px",
						left: "20px",
						backgroundColor: "rgba(0, 0, 0, 0.9)",
						color: "white",
						padding: "20px",
						borderRadius: "12px",
						minWidth: "300px",
						fontSize: "14px",
						fontFamily: "system-ui, -apple-system, sans-serif",
						border: `3px solid ${containers.find((c) => c.name === selectedContainer)?.color || "#64b5f6"}`,
						boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
						backdropFilter: "blur(10px)",
						zIndex: 1000,
					}}
				>
					<h3
						style={{
							margin: "0 0 16px 0",
							color: containers.find((c) => c.name === selectedContainer)?.color || "#64b5f6",
						}}
					>
						Container Information - Depo 4
					</h3>
					{(() => {
						const container = containers.find((c) => c.name === selectedContainer);
						return container ? (
							<div>
								<div>
									<strong>Container Code:</strong> {container.containerCode || "N/A"}
								</div>
								<div>
									<strong>Block:</strong> {container.blockName || "N/A"}
								</div>
								<div>
									<strong>Block Orientation:</strong> {container.blockOrientation || "N/A"} {container.isBlockRotated ? "(Rotated)" : "(Aligned)"}
								</div>
								<div>
									<strong>Position:</strong> Row {container.row}, Column {container.column}
								</div>
								<div>
									<strong>Tier:</strong> {container.tier || "N/A"}
								</div>
								<div>
									<strong>Size:</strong> {container.size || "N/A"}ft Container
								</div>
								<div>
									<strong>Grade:</strong> {container.grade || "No Grade"}
								</div>
								<div
									style={{
										marginTop: "16px",
										paddingTop: "16px",
										borderTop: "1px solid #333",
									}}
								>
									<div>
										<strong>Mesh Name:</strong> {selectedContainer}
									</div>
									<div>
										<strong>3D Position:</strong> ({container.position[0].toFixed(1)}, {container.position[1].toFixed(1)}, {container.position[2].toFixed(1)})
									</div>
									<div>
										<strong>Color:</strong> {container.color}
									</div>
									<div>
										<strong>Rotation (degrees):</strong> X:
										{((container.rotation[0] * 180) / Math.PI).toFixed(1)}°, Y:
										{((container.rotation[1] * 180) / Math.PI).toFixed(1)}°, Z:
										{((container.rotation[2] * 180) / Math.PI).toFixed(1)}°
									</div>
								</div>
							</div>
						) : null;
					})()}
					<button
						onClick={() => setSelectedContainer(null)}
						style={{
							marginTop: "16px",
							padding: "8px 16px",
							backgroundColor: "transparent",
							border: `2px solid ${containers.find((c) => c.name === selectedContainer)?.color || "#64b5f6"}`,
							color: "white",
							borderRadius: "6px",
							cursor: "pointer",
							fontSize: "12px",
						}}
					>
						Close
					</button>
				</div>
			)}

			{/* Container Legend */}
			<div
				style={{
					position: "absolute",
					bottom: "20px",
					right: "20px",
					backgroundColor: "rgba(0, 0, 0, 0.8)",
					color: "white",
					padding: "16px",
					borderRadius: "8px",
					fontSize: "12px",
					fontFamily: "system-ui, -apple-system, sans-serif",
					backdropFilter: "blur(10px)",
					zIndex: 1000,
					maxHeight: "300px",
					overflowY: "auto",
				}}
			>
				<div style={{ marginBottom: "8px", fontWeight: "bold" }}>Depo 4 Containers ({containers.length} total)</div>
				{containers.map((container) => (
					<div
						key={container.name}
						style={{
							display: "flex",
							alignItems: "center",
							marginBottom: "4px",
							cursor: "pointer",
						}}
						onClick={() => handleContainerClick(container.name)}
					>
						<div
							style={{
								width: "12px",
								height: "12px",
								backgroundColor: container.color,
								marginRight: "8px",
								flexShrink: 0,
							}}
						></div>
						<span style={{ fontSize: "10px" }}>
							{container.blockName}-{container.row}-{container.column} T{container.tier}
							{container.containerCode ? ` (${container.containerCode.substring(0, 15)}...)` : ""}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

useGLTF.preload("/cy-block/depo-4.glb");
