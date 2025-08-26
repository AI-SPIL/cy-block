# Quick Start Guide

## Basic Usage

### 1. Simple Demo

```tsx
import Demo from "./components/examples/Demo";

function App() {
	return <Demo />;
}
```

### 2. Custom Yard Configuration

```tsx
import { ContainerYardScene } from "./components/examples";
import type { YardConfig, GridSlot } from "./components/examples";

const customConfig: YardConfig = {
	gridSize: { width: 6, height: 8 }, // 6x8 grid
	physicalSize: { width: 120, height: 160 }, // 120x160 meters
	position: [50, 0, 50], // Offset position
	backgroundColor: "#1a1a1a", // Dark gray background
	gridColor: "#00ff00", // Green grid lines
};

const containers: GridSlot[] = [
	{
		gridX: 0,
		gridY: 0,
		tier: 0,
		container: {
			code: "CUSTOM001",
			size: ContainerSize.FORTY_FOOT,
			grade: ContainerGrade.A,
			status: ContainerStatus.OCCUPIED,
			vesselVoyage: "VESSEL-001",
		},
	},
];

<ContainerYardScene config={customConfig} slots={containers} onContainerClick={(container) => console.log("Clicked:", container)} />;
```

### 3. Multiple Yards

```tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ContainerYard } from "./components/examples";

function MultipleYards() {
	return (
		<Canvas>
			<ambientLight intensity={0.6} />
			<directionalLight position={[50, 50, 25]} intensity={0.8} />

			{/* Yard 1 */}
			<ContainerYard config={{ ...config, position: [0, 0, 0] }} slots={yard1Containers} />

			{/* Yard 2 */}
			<ContainerYard config={{ ...config, position: [150, 0, 0] }} slots={yard2Containers} />

			<OrbitControls />
		</Canvas>
	);
}
```

## Container Specifications

-   **20ft Container**: 1 grid unit wide
-   **40ft Container**: 2 grid units wide
-   **Tier Height**: 1.1 meters per stack level
-   **Grid Spacing**: Calculated automatically based on yard size

## Controls

-   **Mouse Drag**: Rotate camera view
-   **Mouse Wheel**: Zoom in/out
-   **Right Click + Drag**: Pan camera
-   **Click Container**: Select and view details
-   **Hover Container**: Show tooltip with information
