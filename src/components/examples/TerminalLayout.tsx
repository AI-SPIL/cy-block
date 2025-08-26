import React, { useState } from "react";
import type { ContainerInfo } from "./Container";
import { Container, ContainerGrade, ContainerSize, ContainerStatus, GroundGrid } from "./Container";
import type { YardConfig } from "./ContainerYard";
import { ContainerYardScene } from "./ContainerYard";

/**
 * Terminal Layout Component
 *
 * Creates a container terminal layout matching the provided diagram:
 * - 3x3 grid of blocks
 * - Each block contains multiple container slots
 * - Small blocks for 20ft containers
 * - Large blocks for 40ft containers
 * - Random empty and occupied slots
 * - Empty slots show white borders only
 */

interface ContainerSlot {
	position: [number, number, number];
	container?: ContainerInfo;
	size: ContainerSize;
	isEmpty: boolean;
	rotation?: [number, number, number];
	gridPosition: { blockRow: number; blockCol: number; row: number; col: number };
}

interface GroundGrid {
	position: [number, number, number];
	size: ContainerSize;
	rotation?: number;
}

/**
 * Generate container terminal layout with proper stacking from ground up
 */
const generateTerminalLayout = (): { containers: ContainerSlot[]; groundGrids: GroundGrid[] } => {
	const containers: ContainerSlot[] = [];
	const groundGrids: GroundGrid[] = [];
	const blockSpacing = 15; // Distance between blocks
	const blockCols = 3;
	const blockRows = 3;

	// Generate sample container codes
	let containerCounter = 1;

	// Create a grid to track container stacks
	interface StackPosition {
		x: number;
		z: number;
		size: ContainerSize;
		height: number; // Current stack height
		maxHeight: number; // Maximum allowed height
	}

	for (let blockRow = 0; blockRow < blockRows; blockRow++) {
		for (let blockCol = 0; blockCol < blockCols; blockCol++) {
			// Base position for this block
			const baseX = (blockCol - 1) * blockSpacing;
			const baseZ = (blockRow - 1) * blockSpacing;

			// Define possible positions for this block
			const stackPositions: StackPosition[] = [];

			// Randomly decide the layout for this block
			const blockLayout = Math.random();

			if (blockLayout < 0.4) {
				// Layout 1: 20ft container positions (2x4 grid)
				for (let row = 0; row < 4; row++) {
					for (let col = 0; col < 2; col++) {
						stackPositions.push({
							x: baseX + col * 1.2 - 0.6,
							z: baseZ + row * 1.2 - 2.4,
							size: ContainerSize.TWENTY_FOOT,
							height: 0,
							maxHeight: Math.floor(Math.random() * 3) + 1, // 1-3 containers high
						});
					}
				}
			} else if (blockLayout < 0.7) {
				// Layout 2: 40ft container positions (2x2 grid)
				for (let row = 0; row < 2; row++) {
					for (let col = 0; col < 2; col++) {
						stackPositions.push({
							x: baseX + col * 2.4 - 1.2,
							z: baseZ + row * 2.4 - 1.2,
							size: ContainerSize.FORTY_FOOT,
							height: 0,
							maxHeight: Math.floor(Math.random() * 4) + 1, // 1-4 containers high
						});
					}
				}
			} else {
				// Layout 3: Mixed containers
				// Add 40ft positions
				for (let i = 0; i < 2; i++) {
					stackPositions.push({
						x: baseX + (i % 2) * 2.4 - 1.2,
						z: baseZ - 1.2,
						size: ContainerSize.FORTY_FOOT,
						height: 0,
						maxHeight: Math.floor(Math.random() * 3) + 1,
					});
				}

				// Add 20ft positions
				for (let row = 0; row < 2; row++) {
					for (let col = 0; col < 4; col++) {
						stackPositions.push({
							x: baseX + col * 1.2 - 1.8,
							z: baseZ + row * 1.2 + 0.6,
							size: ContainerSize.TWENTY_FOOT,
							height: 0,
							maxHeight: Math.floor(Math.random() * 2) + 1,
						});
					}
				}
			}

			// For each stack position, decide if it should have containers and how many
			stackPositions.forEach((stackPos) => {
				// Skip positions that are too close to center origin (0,0,0) to avoid floating containers
				const isNearCenter = Math.abs(stackPos.x) < 1 && Math.abs(stackPos.z) < 1;

				// Reduce container probability for center block to avoid clutter
				const isCenterBlock = blockRow === 1 && blockCol === 1;
				const containerProbability = isCenterBlock ? 0.5 : 0.7; // 50% for center, 70% for others

				const hasContainers = Math.random() > 1 - containerProbability;

				if (hasContainers && !isNearCenter) {
					// Create containers stacked from bottom to top
					for (let tier = 0; tier < stackPos.maxHeight; tier++) {
						// Sometimes leave gaps in the stack (except at the bottom)
						const shouldHaveContainer = tier === 0 ? true : Math.random() > 0.2; // 80% chance for upper levels

						if (shouldHaveContainer) {
							const position: [number, number, number] = [
								stackPos.x,
								tier * 1.2 + 0.6, // Stack from ground up (0.6 is half container height)
								stackPos.z,
							];

							containers.push({
								position,
								size: stackPos.size,
								isEmpty: false,
								gridPosition: { blockRow, blockCol, row: 0, col: 0 },
								container: {
									code: `TL${stackPos.size === ContainerSize.FORTY_FOOT ? "40" : "20"}${String(containerCounter++).padStart(4, "0")}`,
									vesselVoyage: `VESSEL-${Math.floor(Math.random() * 50) + 1}`,
									size: stackPos.size,
									grade: [ContainerGrade.A, ContainerGrade.B, ContainerGrade.C][Math.floor(Math.random() * 3)],
									status: ContainerStatus.OCCUPIED,
									metadata: {
										weight: Math.round((Math.random() * (stackPos.size === ContainerSize.FORTY_FOOT ? 15 : 10) + (stackPos.size === ContainerSize.FORTY_FOOT ? 25 : 10)) * 10) / 10,
										destination: ["Los Angeles", "New York", "Seattle", "Houston", "Miami"][Math.floor(Math.random() * 5)],
										contents:
											stackPos.size === ContainerSize.FORTY_FOOT
												? ["Heavy Machinery", "Construction Materials", "Vehicles", "Industrial Equipment"][Math.floor(Math.random() * 4)]
												: ["Electronics", "Textiles", "Machinery", "Food Products", "Auto Parts"][Math.floor(Math.random() * 5)],
									},
								},
							});
						}
					}
				} else if (!isNearCenter) {
					// Create ground grid marker for empty position (but not near center)
					// Reduce overlapping by using a grid-based approach instead of random rotations
					const shouldTilt = Math.random() < 0.15; // Reduced chance of tilted grid to 15%
					const rotation = shouldTilt ? (Math.random() < 0.5 ? Math.PI / 6 : -Math.PI / 6) : 0; // Fixed angles to prevent overlap

					// Only add grid if there's enough spacing from existing grids
					const minDistance = stackPos.size === ContainerSize.FORTY_FOOT ? 3 : 2;
					const tooClose = groundGrids.some(existingGrid => {
						const dx = Math.abs(existingGrid.position[0] - stackPos.x);
						const dz = Math.abs(existingGrid.position[2] - stackPos.z);
						return dx < minDistance && dz < minDistance;
					});

					if (!tooClose) {
						groundGrids.push({
							position: [stackPos.x, 0.005, stackPos.z], // Lower height to prevent z-fighting
							size: stackPos.size,
							rotation: rotation,
						});
					}
				}
			});
		}
	}

	// Add extensive additional areas to create a realistic container yard
	const additionalAreas = generateAdditionalYardAreas(containerCounter);
	containers.push(...additionalAreas.containers);
	groundGrids.push(...additionalAreas.groundGrids);

	return { containers, groundGrids };
};

/**
 * Generate additional yard areas with tilted containers and more realistic layout
 */
const generateAdditionalYardAreas = (startCounter: number): { containers: ContainerSlot[]; groundGrids: GroundGrid[] } => {
	const containers: ContainerSlot[] = [];
	const groundGrids: GroundGrid[] = [];
	let containerCounter = startCounter;

	// Create curved/angled section like in the diagram (top curved area)
	const curvedSectionPositions = [
		{ x: -10, z: 35, rotation: Math.PI / 6 }, // 30°
		{ x: -5, z: 37, rotation: Math.PI / 4 }, // 45°
		{ x: 0, z: 38, rotation: Math.PI / 3 }, // 60°
		{ x: 5, z: 37, rotation: Math.PI / 2.5 }, // 72°
		{ x: 10, z: 35, rotation: Math.PI / 2 }, // 90°
		{ x: 14, z: 32, rotation: (2 * Math.PI) / 3 }, // 120°
		{ x: 17, z: 28, rotation: (3 * Math.PI) / 4 }, // 135°
		{ x: 19, z: 23, rotation: (5 * Math.PI) / 6 }, // 150°
	];

	curvedSectionPositions.forEach((pos, index) => {
		const hasContainer = Math.random() > 0.3; // 70% chance
		const size = Math.random() > 0.6 ? ContainerSize.FORTY_FOOT : ContainerSize.TWENTY_FOOT;

		if (hasContainer) {
			containers.push({
				position: [pos.x, 0.6, pos.z],
				size,
				isEmpty: false,
				rotation: [0, pos.rotation, 0],
				gridPosition: { blockRow: -1, blockCol: -1, row: index, col: 0 },
				container: {
					code: `CV${size === ContainerSize.FORTY_FOOT ? "40" : "20"}${String(containerCounter++).padStart(4, "0")}`,
					vesselVoyage: `CURVED-${Math.floor(Math.random() * 20) + 1}`,
					size,
					grade: [ContainerGrade.A, ContainerGrade.B, ContainerGrade.C][Math.floor(Math.random() * 3)],
					status: ContainerStatus.OCCUPIED,
					metadata: {
						weight: Math.round((Math.random() * (size === ContainerSize.FORTY_FOOT ? 15 : 10) + (size === ContainerSize.FORTY_FOOT ? 25 : 10)) * 10) / 10,
						destination: ["Port A", "Port B", "Port C", "Port D"][Math.floor(Math.random() * 4)],
						contents:
							size === ContainerSize.FORTY_FOOT
								? ["Heavy Equipment", "Steel Beams", "Vehicles", "Machinery"][Math.floor(Math.random() * 4)]
								: ["General Cargo", "Textiles", "Electronics", "Consumer Goods"][Math.floor(Math.random() * 4)],
					},
				},
			});
		} else {
			// Improved grid placement for empty positions in curved section
			const minDistance = size === ContainerSize.FORTY_FOOT ? 3 : 2;
			const tooClose = groundGrids.some(existingGrid => {
				const dx = Math.abs(existingGrid.position[0] - pos.x);
				const dz = Math.abs(existingGrid.position[2] - pos.z);
				return dx < minDistance && dz < minDistance;
			});

			if (!tooClose) {
				groundGrids.push({
					position: [pos.x, 0.005, pos.z], // Lower height to prevent overlap
					size,
					rotation: pos.rotation,
				});
			}
		}
	});

	// Add more organized blocks (like in diagram - left side stacked blocks)
	const organizedBlocks = [
		// Left side vertical stacks
		{ baseX: -35, baseZ: 10, rows: 4, cols: 2, rotation: 0 },
		{ baseX: -35, baseZ: -5, rows: 4, cols: 2, rotation: 0 },
		{ baseX: -35, baseZ: -20, rows: 4, cols: 2, rotation: 0 },

		// Right side angled stacks
		{ baseX: 30, baseZ: 15, rows: 3, cols: 3, rotation: Math.PI / 8 }, // 22.5°
		{ baseX: 30, baseZ: -5, rows: 3, cols: 3, rotation: -Math.PI / 8 }, // -22.5°
		{ baseX: 30, baseZ: -25, rows: 3, cols: 3, rotation: Math.PI / 6 }, // 30°

		// Bottom area with various angles
		{ baseX: -15, baseZ: -35, rows: 2, cols: 4, rotation: Math.PI / 12 }, // 15°
		{ baseX: 0, baseZ: -35, rows: 2, cols: 4, rotation: -Math.PI / 12 }, // -15°
		{ baseX: 15, baseZ: -35, rows: 2, cols: 4, rotation: Math.PI / 10 }, // 18°
	];

	organizedBlocks.forEach((block, blockIndex) => {
		for (let row = 0; row < block.rows; row++) {
			for (let col = 0; col < block.cols; col++) {
				// Calculate position with rotation
				const localX = col * 1.2 - (block.cols - 1) * 0.6;
				const localZ = row * 1.2 - (block.rows - 1) * 0.6;

				// Apply rotation to local coordinates
				const rotatedX = localX * Math.cos(block.rotation) - localZ * Math.sin(block.rotation);
				const rotatedZ = localX * Math.sin(block.rotation) + localZ * Math.cos(block.rotation);

				const worldX = block.baseX + rotatedX;
				const worldZ = block.baseZ + rotatedZ;

				const hasContainer = Math.random() > 0.25; // 75% chance
				const size = Math.random() > 0.5 ? ContainerSize.FORTY_FOOT : ContainerSize.TWENTY_FOOT;
				const stackHeight = Math.floor(Math.random() * 3) + 1; // 1-3 high

				if (hasContainer) {
					// Stack containers from ground up
					for (let tier = 0; tier < stackHeight; tier++) {
						const shouldHaveContainer = tier === 0 ? true : Math.random() > 0.3; // 70% chance for upper levels

						if (shouldHaveContainer) {
							containers.push({
								position: [worldX, tier * 1.2 + 0.6, worldZ],
								size,
								isEmpty: false,
								rotation: [0, block.rotation, 0],
								gridPosition: { blockRow: blockIndex, blockCol: -1, row, col },
								container: {
									code: `OB${size === ContainerSize.FORTY_FOOT ? "40" : "20"}${String(containerCounter++).padStart(4, "0")}`,
									vesselVoyage: `BLOCK-${blockIndex + 1}-${Math.floor(Math.random() * 30) + 1}`,
									size,
									grade: [ContainerGrade.A, ContainerGrade.B, ContainerGrade.C][Math.floor(Math.random() * 3)],
									status: ContainerStatus.OCCUPIED,
									metadata: {
										weight: Math.round((Math.random() * (size === ContainerSize.FORTY_FOOT ? 15 : 10) + (size === ContainerSize.FORTY_FOOT ? 25 : 10)) * 10) / 10,
										destination: ["International Hub", "Regional Port", "Local Terminal", "Export Zone"][Math.floor(Math.random() * 4)],
										contents:
											size === ContainerSize.FORTY_FOOT
												? ["Industrial Equipment", "Construction Materials", "Heavy Machinery", "Steel Products"][Math.floor(Math.random() * 4)]
												: ["Consumer Electronics", "Clothing", "Packaged Goods", "Small Parts"][Math.floor(Math.random() * 4)],
									},
								},
							});
						}
					}
				} else {
					// Add empty grid with overlap prevention
					const minDistance = size === ContainerSize.FORTY_FOOT ? 3 : 2;
					const tooClose = groundGrids.some(existingGrid => {
						const dx = Math.abs(existingGrid.position[0] - worldX);
						const dz = Math.abs(existingGrid.position[2] - worldZ);
						return dx < minDistance && dz < minDistance;
					});

					if (!tooClose) {
						groundGrids.push({
							position: [worldX, 0.005, worldZ], // Lower height to prevent overlap
							size,
							rotation: block.rotation,
						});
					}
				}
			}
		}
	});

	// Add scattered individual tilted containers for variety
	const scatteredPositions = [
		{ x: -25, z: 30, rotation: Math.PI / 3 },
		{ x: 25, z: 30, rotation: -Math.PI / 4 },
		{ x: -30, z: -30, rotation: Math.PI / 5 },
		{ x: 35, z: -15, rotation: -Math.PI / 3 },
		{ x: -40, z: 0, rotation: Math.PI / 6 },
		{ x: 40, z: 0, rotation: -Math.PI / 6 },
	];

	scatteredPositions.forEach((pos, index) => {
		const hasContainer = Math.random() > 0.4; // 60% chance
		const size = Math.random() > 0.4 ? ContainerSize.FORTY_FOOT : ContainerSize.TWENTY_FOOT;

		if (hasContainer) {
			containers.push({
				position: [pos.x, 0.6, pos.z],
				size,
				isEmpty: false,
				rotation: [0, pos.rotation, 0],
				gridPosition: { blockRow: -2, blockCol: -2, row: index, col: 0 },
				container: {
					code: `SC${size === ContainerSize.FORTY_FOOT ? "40" : "20"}${String(containerCounter++).padStart(4, "0")}`,
					vesselVoyage: `SCATTERED-${index + 1}`,
					size,
					grade: [ContainerGrade.A, ContainerGrade.B, ContainerGrade.C][Math.floor(Math.random() * 3)],
					status: ContainerStatus.OCCUPIED,
					metadata: {
						weight: Math.round((Math.random() * (size === ContainerSize.FORTY_FOOT ? 15 : 10) + (size === ContainerSize.FORTY_FOOT ? 25 : 10)) * 10) / 10,
						destination: ["Special Zone", "Customs Area", "Inspection Point", "Transit Hub"][Math.floor(Math.random() * 4)],
						contents:
							size === ContainerSize.FORTY_FOOT
								? ["Oversized Cargo", "Project Equipment", "Special Machinery", "Custom Items"][Math.floor(Math.random() * 4)]
								: ["Priority Goods", "Express Delivery", "High Value Items", "Time Sensitive"][Math.floor(Math.random() * 4)],
					},
				},
			});
		} else {
			// Add scattered area grid with overlap prevention
			const minDistance = size === ContainerSize.FORTY_FOOT ? 3 : 2;
			const tooClose = groundGrids.some(existingGrid => {
				const dx = Math.abs(existingGrid.position[0] - pos.x);
				const dz = Math.abs(existingGrid.position[2] - pos.z);
				return dx < minDistance && dz < minDistance;
			});

			if (!tooClose) {
				groundGrids.push({
					position: [pos.x, 0.005, pos.z], // Lower height to prevent overlap
					size,
					rotation: pos.rotation,
				});
			}
		}
	});

	return { containers, groundGrids };
};

/**
 * Terminal Layout with 3x3 blocks like the diagram
 */
export const TerminalLayout: React.FC = () => {
	const [selectedContainer, setSelectedContainer] = useState<ContainerInfo | null>(null);
	const [terminalData] = useState(() => generateTerminalLayout());

	// Yard configuration for the expanded terminal
	const yardConfig: YardConfig = {
		gridSize: { width: 5, height: 5 },
		physicalSize: { width: 120, height: 120 }, // 120x120 meters for expanded yard
		position: [0, 0, 0],
		backgroundColor: "#000000",
		gridColor: "#333333",
		maxTiers: 4,
	};

	// Container color mapping
	const getContainerColor = (container: ContainerInfo): string => {
		switch (container.grade) {
			case ContainerGrade.A:
				return "#00dd88"; // Bright green
			case ContainerGrade.B:
				return "#0099ff"; // Bright blue
			case ContainerGrade.C:
				return "#ff8800"; // Orange
			default:
				return "#0099ff";
		}
	};

	const handleContainerClick = (container: ContainerInfo) => {
		setSelectedContainer(container === selectedContainer ? null : container);
	};

	return (
		<div style={{ width: "100vw", height: "100vh", position: "relative" }}>
			<ContainerYardScene
				config={yardConfig}
				slots={[]} // We'll render containers manually for more control
				selectedContainer={selectedContainer}
				onContainerClick={handleContainerClick}
				showTooltips={true}
				enableControls={true}
				fov={60}
				lighting={{
					ambientIntensity: 0.7,
					directionalIntensity: 0.9,
					directionalPosition: [50, 60, 30],
				}}
				style={{
					background: "linear-gradient(to bottom, #0a0f1a 0%, #000000 100%)",
				}}
			>
				{/* Render containers with proper stacking and rotation */}
				{terminalData.containers.map((slot, index) => (
					<Container
						key={`container-${index}`}
						position={slot.position}
						info={slot.container!}
						color={getContainerColor(slot.container!)}
						rotation={slot.rotation}
						selected={selectedContainer === slot.container}
						onClick={handleContainerClick}
						showTooltip={true}
					/>
				))}

				{/* Render ground grids for empty positions */}
				{terminalData.groundGrids.map((grid, index) => (
					<GroundGrid key={`grid-${index}`} position={grid.position} size={grid.size} rotation={grid.rotation} />
				))}
			</ContainerYardScene>

			{/* Selected Container Info Panel */}
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
						border: `3px solid ${getContainerColor(selectedContainer)}`,
						boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
						backdropFilter: "blur(10px)",
						zIndex: 1000,
					}}
				>
					<h3 style={{ margin: "0 0 16px 0", color: getContainerColor(selectedContainer) }}>Selected Container</h3>
					<div>
						<strong>Code:</strong> {selectedContainer.code}
					</div>
					<div>
						<strong>Size:</strong> {selectedContainer.size}
					</div>
					<div>
						<strong>Grade:</strong> {selectedContainer.grade}
					</div>
					<div>
						<strong>Status:</strong> {selectedContainer.status}
					</div>
					{selectedContainer.vesselVoyage && (
						<div>
							<strong>Vessel:</strong> {selectedContainer.vesselVoyage}
						</div>
					)}
					{selectedContainer.metadata && (
						<div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #333" }}>
							{selectedContainer.metadata.weight && (
								<div>
									<strong>Weight:</strong> {selectedContainer.metadata.weight} tons
								</div>
							)}
							{selectedContainer.metadata.destination && (
								<div>
									<strong>Destination:</strong> {selectedContainer.metadata.destination}
								</div>
							)}
							{selectedContainer.metadata.contents && (
								<div>
									<strong>Contents:</strong> {selectedContainer.metadata.contents}
								</div>
							)}
						</div>
					)}
					<button
						onClick={() => setSelectedContainer(null)}
						style={{
							marginTop: "16px",
							padding: "8px 16px",
							backgroundColor: "transparent",
							border: `2px solid ${getContainerColor(selectedContainer)}`,
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

			{/* Legend */}
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
				}}
			>
				<div style={{ marginBottom: "8px", fontWeight: "bold" }}>Container Grades</div>
				<div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
					<div style={{ width: "12px", height: "12px", backgroundColor: "#00dd88", marginRight: "8px" }}></div>
					Grade A
				</div>
				<div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
					<div style={{ width: "12px", height: "12px", backgroundColor: "#0099ff", marginRight: "8px" }}></div>
					Grade B
				</div>
				<div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
					<div style={{ width: "12px", height: "12px", backgroundColor: "#ff8800", marginRight: "8px" }}></div>
					Grade C
				</div>
				<div style={{ display: "flex", alignItems: "center" }}>
					<div style={{ width: "12px", height: "12px", backgroundColor: "transparent", border: "1px solid white", marginRight: "8px" }}></div>
					Empty Slot
				</div>
			</div>
		</div>
	);
};

export default TerminalLayout;
