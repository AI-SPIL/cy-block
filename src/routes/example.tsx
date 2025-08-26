import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { Container, type PositionedContainer } from "../components/main/container";
import { GLBModel } from "../components/main/model";

export default function Example() {
	const [selectedContainer, setSelectedContainer] = useState<string | null>(null);
	const [containers, setContainers] = useState<PositionedContainer[]>([]);

	const handleMeshPositionsReady = (positions: { [key: string]: { position: [number, number, number]; size: [number, number, number] } }) => {
		// Define container colors for each position
		const containerColors = {
			BL: "#ff4444", // Red
			BR: "#44ff44", // Green
			TL: "#4444ff", // Blue
			TR: "#ffff44", // Yellow
		};

		const newContainers: PositionedContainer[] = Object.entries(positions).map(([meshName, data]) => ({
			position: [data.position[0], data.position[1] + 1.5, data.position[2]], // Lift containers 10ft (3m) above ground
			meshSize: data.size,
			color: containerColors[meshName as keyof typeof containerColors] || "#64b5f6",
			name: meshName,
		}));

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

				{/* Load and display GLB model */}
				<GLBModel onMeshPositionsReady={handleMeshPositionsReady} />

				{/* Render custom containers at mesh centers */}
				{containers.map((containerData, index) => (
					<Container key={`container-${index}`} container={containerData} selected={selectedContainer === containerData.name} onSelect={handleContainerClick} />
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
						Container Information
					</h3>
					<div>
						<strong>Position:</strong> {selectedContainer}
					</div>
					<div>
						<strong>Size:</strong> 10ft Container
					</div>
					<div>
						<strong>Height:</strong> 10ft (3m)
					</div>
					<div>
						<strong>Type:</strong> Custom Container
					</div>
					{(() => {
						const container = containers.find((c) => c.name === selectedContainer);
						return container ? (
							<div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #333" }}>
								<div>
									<strong>Mesh Size:</strong> {container.meshSize[0].toFixed(1)} x {container.meshSize[1].toFixed(1)} x {container.meshSize[2].toFixed(1)}
								</div>
								<div>
									<strong>Position:</strong> ({container.position[0].toFixed(1)}, {container.position[1].toFixed(1)}, {container.position[2].toFixed(1)})
								</div>
								<div>
									<strong>Color:</strong> {container.color}
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
				}}
			>
				<div style={{ marginBottom: "8px", fontWeight: "bold" }}>Container Positions</div>
				<div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
					<div style={{ width: "12px", height: "12px", backgroundColor: "#ff4444", marginRight: "8px" }}></div>
					BL (Bottom Left)
				</div>
				<div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
					<div style={{ width: "12px", height: "12px", backgroundColor: "#44ff44", marginRight: "8px" }}></div>
					BR (Bottom Right)
				</div>
				<div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
					<div style={{ width: "12px", height: "12px", backgroundColor: "#4444ff", marginRight: "8px" }}></div>
					TL (Top Left)
				</div>
				<div style={{ display: "flex", alignItems: "center" }}>
					<div style={{ width: "12px", height: "12px", backgroundColor: "#ffff44", marginRight: "8px" }}></div>
					TR (Top Right)
				</div>
			</div>
		</div>
	);
}

useGLTF.preload("/cy-block/floor.glb");
