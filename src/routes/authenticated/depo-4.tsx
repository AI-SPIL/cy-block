import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import {
	Container,
	type PositionedContainer,
} from "../../components/main/container";
import { Depo4GLBModel } from "../../components/main/depo4-model";

export default function Depo4() {
	const [selectedContainer, setSelectedContainer] = useState<string | null>(
		null
	);
	const [containers, setContainers] = useState<PositionedContainer[]>([]);

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

		const newContainers: PositionedContainer[] = Object.entries(positions).map(
			([meshName, data], index) => {
				return {
					position: [
						data.position[0],
						data.position[1] + 1.5,
						data.position[2],
					], // Lift containers 1.5m above ground
					meshSize: data.size,
					rotation: data.rotation,
					color: colors[index % colors.length],
					name: meshName,
				};
			}
		);

		setContainers(newContainers);
	};

	const handleContainerClick = (containerName: string) => {
		setSelectedContainer(
			selectedContainer === containerName ? null : containerName
		);
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
				<Depo4GLBModel onMeshPositionsReady={handleMeshPositionsReady} />

				{/* Render custom containers at mesh centers */}
				{containers.map((containerData, index) => (
					<Container
						key={`container-${index}`}
						container={containerData}
						selected={selectedContainer === containerData.name}
						onSelect={handleContainerClick}
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
						<strong>Type:</strong> Depo 4 Container
					</div>
					{(() => {
						const container = containers.find(
							(c) => c.name === selectedContainer
						);
						return container ? (
							<div
								style={{
									marginTop: "16px",
									paddingTop: "16px",
									borderTop: "1px solid #333",
								}}
							>
								<div>
									<strong>Mesh Size:</strong> {container.meshSize[0].toFixed(1)}{" "}
									x {container.meshSize[1].toFixed(1)} x{" "}
									{container.meshSize[2].toFixed(1)}
								</div>
								<div>
									<strong>Position:</strong> ({container.position[0].toFixed(1)}
									, {container.position[1].toFixed(1)},{" "}
									{container.position[2].toFixed(1)})
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
				<div style={{ marginBottom: "8px", fontWeight: "bold" }}>
					Depo 4 Container Positions
				</div>
				{containers.map((container) => (
					<div
						key={container.name}
						style={{
							display: "flex",
							alignItems: "center",
							marginBottom: "4px",
						}}
					>
						<div
							style={{
								width: "12px",
								height: "12px",
								backgroundColor: container.color,
								marginRight: "8px",
							}}
						></div>
						{container.name}
					</div>
				))}
			</div>
		</div>
	);
}

useGLTF.preload("/cy-block/3D Platform Depo 4.glb");
