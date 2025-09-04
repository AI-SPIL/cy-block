import { depo4Data } from "@/data/depo-4";
import { depoJapfaData } from "@/data/depo-japfa";
import { depoYonData } from "@/data/depo-yon";
import { mappingBayurData } from "@/data/mapping-bayur";
import type { ExampleResponse } from "@/data/types";
import {
	getContainerColor,
	STATUS_COLORS,
	GRADE_COLORS,
	getStatusColorName,
} from "@/helpers/color-helpers";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState, useEffect } from "react";
import { Container, type PositionedContainer } from "./container";
import { Floor } from "./floor";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";

type DepoType = "JAPFA" | "4" | "BAYUR" | "YON";

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
		model: "/cy-block/depo-japfa.glb",
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
	YON: {
		model: "/cy-block/new-depo-yon.glb",
		data: depoYonData,
	},
} satisfies Record<DepoType, { model: string; data: ExampleResponse }>;

export default function DisplayYard({ name, containerSize }: DisplayYardProps) {
	const [selectedContainer, setSelectedContainer] = useState<string | null>(
		null
	);
	const [containers, setContainers] = useState<PositionedContainer[]>([]);
	const [colorBy, setColorBy] = useState<"grade" | "status">("grade");
	const [draggedContainer, setDraggedContainer] =
		useState<PositionedContainer | null>(null);
	const [dragMode, setDragMode] = useState<boolean>(false);
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [, setDragPosition] = useState<[number, number, number] | null>(null);

	const size20Container = containerSize.size20;
	const size40Container = containerSize.size40;

	const defaultSize20Vertical = [
		size20Container[2],
		size20Container[1],
		size20Container[0],
	] satisfies [number, number, number];
	const defaultSize20Horizontal = size20Container;
	const defaultSize40Vertical = [
		size40Container[2],
		size40Container[1],
		size40Container[0],
	] satisfies [number, number, number];
	const defaultSize40Horizontal = size40Container;

	const getContainerDimensions = (
		containerSize: string,
		meshSize: [number, number, number],
		rotation: [number, number, number]
	): [number, number, number] => {
		// Check if the block is rotated (not at cardinal directions)
		const shouldApplyRotation = (rotationRad: number, tolerance = 10) => {
			const degrees = Math.abs((rotationRad * 180) / Math.PI) % 360;
			const cardinalAngles = [0, 90, 180, 270];
			return !cardinalAngles.some(
				(cardinal) =>
					Math.abs(degrees - cardinal) <= tolerance ||
					Math.abs(degrees - (cardinal + 360)) <= tolerance
			);
		};

		const isRotated = [rotation[0], rotation[1], rotation[2]].some((r) =>
			shouldApplyRotation(r)
		);

		if (containerSize === "20") {
			// For 20ft containers, determine orientation based on mesh dimensions
			const meshWidth = meshSize[0];
			const meshDepth = meshSize[2];
			const isHorizontalMesh = meshWidth > meshDepth;

			// If block is rotated, use standard dimensions, otherwise match mesh orientation
			if (isRotated) {
				return isHorizontalMesh
					? defaultSize20Horizontal
					: defaultSize20Vertical;
			} else {
				return isHorizontalMesh
					? defaultSize20Horizontal
					: defaultSize20Vertical;
			}
		} else if (containerSize === "40") {
			// For 40ft containers, always use the default props dimensions
			// Don't determine orientation based on mesh - use default size40 from props
			console.log(
				"Display-yard: Size 40 container using HORIZONTAL:",
				defaultSize40Horizontal
			);
			console.log(
				"Display-yard: Size 40 available vertical would be:",
				defaultSize40Vertical
			);
			return defaultSize40Horizontal; // Always use horizontal orientation for size 40
		} // Fallback: use mesh dimensions with actual mesh height
		return [meshSize[0], meshSize[1], meshSize[2]];
	};

	const handleMeshPositionsReady = (positions: {
		[key: string]: {
			position: [number, number, number];
			size: [number, number, number];
			rotation: [number, number, number];
		};
	}) => {
		const depoData = PATH_MAPPING[name].data;
		const newContainers: PositionedContainer[] = [];

		// Helper function to detect if container name indicates fractional position
		const getFractionalPosition = (
			containerCode: string
		): number | undefined => {
			const match = containerCode.match(/(\d+)\.(\d+)/);
			if (match) {
				return parseFloat(`0.${match[2]}`); // Convert "1.5" to 0.5
			}
			return undefined;
		};

		// Helper function to get mesh name with support for fractional columns
		const getMeshName = (
			blockName: string,
			column: number,
			row: number,
			containerCode: string,
			size: string
		): string => {
			if (size === "40") {
				// The 3D model uses "135" instead of "13.5" for fractional positions
				return `${blockName}_${column}_${row}5`;
			}
			const fraction = getFractionalPosition(containerCode);
			if (fraction !== undefined) {
				return `${blockName}_${column}_${row}.${
					fraction === 0.5 ? "5" : String(fraction).replace("0.", "")
				}`;
			}
			return `${blockName}_${column}_${row}`;
		};

		depoData.depo_blocks.forEach((block) => {
			block.block_slots.forEach((slot) => {
				const meshName = getMeshName(
					block.block_name,
					slot.column,
					slot.row,
					slot.container_code,
					slot.size
				);
				const meshData = positions[meshName];

				if (meshData) {
					// Check if the block is rotated (not at cardinal directions)
					const shouldApplyRotation = (rotationRad: number, tolerance = 10) => {
						const degrees = Math.abs((rotationRad * 180) / Math.PI) % 360;
						const cardinalAngles = [0, 90, 180, 270];
						return !cardinalAngles.some(
							(cardinal) =>
								Math.abs(degrees - cardinal) <= tolerance ||
								Math.abs(degrees - (cardinal + 360)) <= tolerance
						);
					};

					const isBlockRotated = [
						meshData.rotation[0],
						meshData.rotation[1],
						meshData.rotation[2],
					].some((r) => shouldApplyRotation(r));

					// Determine block orientation based on mesh dimensions
					const meshWidth = meshData.size[0];
					const meshDepth = meshData.size[2];
					const blockOrientation: "horizontal" | "vertical" =
						meshWidth > meshDepth ? "horizontal" : "vertical";

					// Get container dimensions based on rotation and size
					const containerDimensions = getContainerDimensions(
						slot.size,
						meshData.size,
						meshData.rotation
					);

					const containerHeight = containerDimensions[1]; // Y size

					const yPosition =
						meshData.position[1] +
						meshData.size[1] / 2 +
						(slot.tier - 1) * containerHeight;

					const container: PositionedContainer = {
						position: [meshData.position[0], yPosition, meshData.position[2]],
						meshSize: slot.size === "40" ? containerDimensions : meshData.size,
						rotation: meshData.rotation,
						color: getContainerColor(slot.status, slot.grade || null, colorBy),
						name: `${block.block_name}_${slot.column}_${slot.row}_T${slot.tier}`,
						containerCode: slot.container_code,
						size: slot.size,
						grade: slot.grade,
						status: slot.status,
						row: slot.row,
						column: slot.column,
						tier: slot.tier,
						blockName: block.block_name,
						blockOrientation: blockOrientation,
						isBlockRotated: isBlockRotated,
					};

					newContainers.push(container);
				} else {
					console.error(`Mesh not found for ${meshName}`);
				}
			});
		});

		setContainers(newContainers);
	};

	const handleContainerClick = (containerName: string) => {
		setSelectedContainer(
			selectedContainer === containerName ? null : containerName
		);
		if (dragMode && draggedContainer) {
			// Handle drop operation
			const targetContainer = containers.find((c) => c.name === containerName);
			if (targetContainer && targetContainer.isDropTarget) {
				handleDrop(targetContainer, draggedContainer);
				return;
			}
		}
		setSelectedContainer(
			selectedContainer === containerName ? null : containerName
		);
	};

	const handleDragMove = (newPosition: [number, number, number]) => {
		setDragPosition(newPosition);

		// Update the dragged container's position in real-time
		if (draggedContainer) {
			setContainers((currentContainers) =>
				currentContainers.map((c) =>
					c.name === draggedContainer.name
						? {
								...c,
								position: [newPosition[0], newPosition[1], newPosition[2]],
						  }
						: c
				)
			);
		}
	};

	const handleDragStart = (container: PositionedContainer) => {
		setDraggedContainer(container);
		setDragMode(true);
		setIsDragging(true);
		setDragPosition(container.position);

		// Update containers to show drag state
		setContainers((currentContainers) =>
			currentContainers.map((c) => ({
				...c,
				isDragging: c.name === container.name,
				isDropTarget:
					c.name !== container.name &&
					c.blockName === container.blockName && // Same block
					c.row === container.row &&
					c.column === container.column &&
					c.tier !== container.tier, // Different tier only
			}))
		);
	};

	const handleDragEnd = () => {
		// Reset dragged container position if not dropped on valid target
		if (draggedContainer) {
			setContainers((currentContainers) =>
				currentContainers.map((c) => {
					if (c.name === draggedContainer.name) {
						// Reset to original position
						const originalContainer = containers.find(
							(orig) => orig.name === c.name
						);
						return originalContainer
							? { ...c, position: originalContainer.position }
							: c;
					}
					return {
						...c,
						isDragging: false,
						isDropTarget: false,
					};
				})
			);
		}

		setDraggedContainer(null);
		setIsDragging(false);
		setDragPosition(null);
	};

	const handleDrop = (
		targetContainer: PositionedContainer,
		draggedContainer: PositionedContainer
	) => {
		if (!draggedContainer || targetContainer.name === draggedContainer.name) {
			return;
		}

		// Swap container positions/tiers
		setContainers((currentContainers) =>
			currentContainers.map((c) => {
				if (c.name === draggedContainer.name) {
					return {
						...c,
						tier: targetContainer.tier,
						position: [
							targetContainer.position[0],
							targetContainer.position[1],
							targetContainer.position[2],
						],
						name: `${c.blockName}_${c.column}_${c.row}_T${targetContainer.tier}`,
					};
				} else if (c.name === targetContainer.name) {
					return {
						...c,
						tier: draggedContainer.tier,
						position: [
							draggedContainer.position[0],
							draggedContainer.position[1],
							draggedContainer.position[2],
						],
						name: `${c.blockName}_${c.column}_${c.row}_T${draggedContainer.tier}`,
					};
				}
				return c;
			})
		);

		handleDragEnd();
	};

	// Update container colors when colorBy mode changes
	useEffect(() => {
		setContainers((currentContainers) => {
			if (currentContainers.length > 0) {
				return currentContainers.map((container) => {
					try {
						return {
							...container,
							color: getContainerColor(
								container.status || "",
								container.grade || null,
								colorBy
							),
						};
					} catch (error) {
						console.warn("Error updating container color:", error);
						return container; // Keep original container if color update fails
					}
				});
			}
			return currentContainers;
		});
	}, [colorBy]);

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
					background:
						"linear-gradient(to bottom, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
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
				<mesh
					rotation={[-Math.PI / 2, 0, 0]}
					position={[0, -0.1, 0]}
					receiveShadow
				>
					<planeGeometry args={[100, 100]} />
					<meshStandardMaterial
						color="#1a1a1a"
						transparent
						opacity={0.8}
						roughness={0.8}
						metalness={0.1}
					/>
				</mesh>

				{/* Load and display Depo 4 GLB model */}
				<Floor
					path={PATH_MAPPING[name].model}
					onMeshPositionsReady={handleMeshPositionsReady}
				/>

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
						onDragStart={dragMode ? handleDragStart : undefined}
						onDragEnd={dragMode ? handleDragEnd : undefined}
						onDrop={dragMode ? handleDrop : undefined}
						onDragMove={dragMode ? handleDragMove : undefined}
						depoName={name}
					/>
				))}

				{/* Camera Controls - Disabled only when actively dragging */}
				<OrbitControls
					enablePan={!isDragging}
					enableZoom={!isDragging}
					enableRotate={!isDragging}
					minPolarAngle={0}
					maxPolarAngle={Math.PI / 2.2}
					target={[0, 2, 0]}
					zoomSpeed={0.8}
					panSpeed={0.8}
					rotateSpeed={0.5}
				/>
			</Canvas>

			{/* Color Mode Toggle and Drag Mode Toggle */}
			<div className="fixed top-5 left-5 bg-black/80 text-white p-3 rounded-lg backdrop-blur-lg z-[1000]">
				<div className="flex gap-2 mb-2">
					<Button
						onClick={() => setColorBy("grade")}
						size="sm"
						className={`text-xs ${
							colorBy === "grade"
								? "bg-white text-black hover:bg-gray-200"
								: "bg-transparent text-white border border-white hover:bg-white/10"
						}`}
					>
						Grade Colors
					</Button>
					<Button
						onClick={() => setColorBy("status")}
						size="sm"
						className={`text-xs ${
							colorBy === "status"
								? "bg-white text-black hover:bg-gray-200"
								: "bg-transparent text-white border border-white hover:bg-white/10"
						}`}
					>
						Status Colors
					</Button>
				</div>
				<div className="flex gap-2">
					<Button
						onClick={() => setDragMode(!dragMode)}
						size="sm"
						className={`text-xs ${
							dragMode
								? "bg-yellow-500 text-black hover:bg-yellow-400"
								: "bg-transparent text-white border border-white hover:bg-white/10"
						}`}
					>
						{dragMode ? "🔒 Drag ON" : "🔓 Drag OFF"}
					</Button>
				</div>
			</div>

			{/* Color Legend - Moved down a bit */}
			<div className="fixed top-16 right-5 bg-black/80 text-white p-3 rounded-lg backdrop-blur-lg z-[1000] text-xs min-w-[160px]">
				<div className="font-bold mb-2">
					{colorBy === "grade" ? "Grade Legend" : "Status Legend"}
				</div>
				{dragMode && (
					<div className="mb-2 p-2 bg-yellow-900/50 rounded border border-yellow-500">
						<div className="text-yellow-300 font-bold text-xs">
							🔥 DRAG MODE ACTIVE
						</div>
						<div className="text-xs text-yellow-200">
							Click & drag containers to move them between tiers
						</div>
					</div>
				)}
				{colorBy === "grade" ? (
					<div className="space-y-1">
						{Object.entries(GRADE_COLORS).map(([grade, color]) => (
							<div key={grade} className="flex items-center gap-2">
								<div
									className="w-3 h-3 rounded-sm flex-shrink-0"
									style={{ backgroundColor: color }}
								></div>
								<span>Grade {grade}</span>
							</div>
						))}
					</div>
				) : (
					<div className="space-y-1">
						{Object.entries(STATUS_COLORS).map(([status, color]) => (
							<div key={status} className="flex items-center gap-2">
								<div
									className="w-3 h-3 rounded-sm flex-shrink-0"
									style={{ backgroundColor: color }}
								></div>
								<span className="text-xs">
									{status} - {getStatusColorName(status)}
								</span>
							</div>
						))}
					</div>
				)}
			</div>

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
						border: `3px solid ${
							containers.find((c) => c.name === selectedContainer)?.color ||
							"#64b5f6"
						}`,
						boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
						backdropFilter: "blur(10px)",
						zIndex: 1000,
					}}
				>
					<h3
						style={{
							margin: "0 0 16px 0",
							color:
								containers.find((c) => c.name === selectedContainer)?.color ||
								"#64b5f6",
						}}
					>
						Container Information - Depo 4
					</h3>
					{(() => {
						const container = containers.find(
							(c) => c.name === selectedContainer
						);
						return container ? (
							<div>
								<div>
									<strong>Container Code:</strong>{" "}
									{container.containerCode || "N/A"}
								</div>
								<div>
									<strong>Block:</strong> {container.blockName || "N/A"}
								</div>
								<div>
									<strong>Position:</strong> Row {container.row}, Column{" "}
									{container.column}
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
								<div>
									<strong>Status:</strong> {container.status || "N/A"}
									{container.status && (
										<span
											style={{
												marginLeft: "8px",
												padding: "2px 6px",
												borderRadius: "4px",
												fontSize: "10px",
												backgroundColor: getContainerColor(
													container.status,
													null,
													"status"
												),
												color: "white",
											}}
										>
											{getStatusColorName(container.status)}
										</span>
									)}
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
							border: `2px solid ${
								containers.find((c) => c.name === selectedContainer)?.color ||
								"#64b5f6"
							}`,
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
			<div className="fixed bottom-5 right-5 bg-black/80 text-white p-4 rounded-lg text-xs font-mono backdrop-blur-lg z-[1000] w-80">
				<div className="mb-2 font-bold text-sm">
					{name === "JAPFA"
						? "Depo JAPFA"
						: name === "4"
						? "Depo 4"
						: name === "BAYUR"
						? "Depo Teluk Bayur"
						: name === "YON"
						? "Depo YON"
						: `Depo ${name}`}{" "}
					Containers ({containers.length} total)
				</div>
				<ScrollArea className="h-44">
					<div className="space-y-0.5 pr-3">
						{containers.map((container) => (
							<div
								key={container.name}
								className="flex items-center gap-2 p-2 rounded hover:bg-white/10 cursor-pointer transition-colors"
								onClick={() => handleContainerClick(container.name)}
							>
								<div
									className="w-3 h-3 rounded-sm flex-shrink-0"
									style={{ backgroundColor: container.color }}
								></div>
								<span className="text-xs truncate">
									{container.blockName}-{container.row}-{container.column} T
									{container.tier}
									{container.containerCode
										? ` (${container.containerCode.substring(0, 15)}...)`
										: ""}
								</span>
							</div>
						))}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
}
