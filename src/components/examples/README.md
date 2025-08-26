# Container Yard 3D Components

## Components

### Container

The core container component with enhanced features:

```tsx
import { Container, ContainerSize, ContainerStatus, ContainerGrade } from "./Container";

<Container
	position={[x, y, z]}
	info={{
		code: "TCLU1234567",
		vesselVoyage: "VESSEL01-101",
		size: ContainerSize.TWENTY_FOOT,
		grade: ContainerGrade.A,
		status: ContainerStatus.OCCUPIED,
		metadata: {
			weight: 15.5,
			destination: "Los Angeles",
			contents: "Electronics",
		},
	}}
	color="#4caf50"
	selected={false}
	onClick={handleClick}
	onHover={handleHover}
/>;
```

### ContainerYard

Reusable yard system with configurable grid:

```tsx
import { ContainerYard, YardConfig } from "./ContainerYard";

const yardConfig: YardConfig = {
	gridSize: { width: 4, height: 4 },
	physicalSize: { width: 100, height: 100 }, // 100x100 meters
	position: [0, 0, 0],
	backgroundColor: "#000000",
	gridColor: "#ffffff",
};

<ContainerYard config={yardConfig} slots={containerSlots} onContainerClick={handleClick} getContainerColor={getColor} />;
```

### ContainerYardScene

Complete scene with Canvas wrapper:

```tsx
import { ContainerYardScene } from "./ContainerYard";

<ContainerYardScene
	config={yardConfig}
	slots={containerSlots}
	enableControls={true}
	lighting={{
		ambientIntensity: 0.6,
		directionalIntensity: 0.8,
	}}
	style={{ width: "100%", height: "100vh" }}
/>;
```

### ExampleYard

Complete example implementation with sample data:

```tsx
import ExampleYard from "./ExampleYard";

// Ready-to-use component with 4x4 grid and sample containers
<ExampleYard />;
```

## Usage Examples

### Basic Yard Setup

```tsx
const config: YardConfig = {
	gridSize: { width: 4, height: 4 },
	physicalSize: { width: 100, height: 100 },
	backgroundColor: "#000000",
	gridColor: "#ffffff",
};

const slots: GridSlot[] = [
	{
		gridX: 0,
		gridY: 0,
		tier: 0,
		container: {
			code: "DEMO001",
			size: ContainerSize.TWENTY_FOOT,
			grade: ContainerGrade.A,
			status: ContainerStatus.OCCUPIED,
		},
	},
];
```

### Custom Container Colors

```tsx
const getContainerColor = (container: ContainerInfo): string => {
	switch (container.status) {
		case ContainerStatus.OCCUPIED:
			return container.grade === ContainerGrade.A ? "#4caf50" : "#2196f3";
		case ContainerStatus.RESERVED:
			return "#9c27b0";
		default:
			return "#757575";
	}
};
```

### Multiple Yards

```tsx
const yards = [
	{ config: yardConfig1, slots: slots1, position: [0, 0, 0] },
	{ config: yardConfig2, slots: slots2, position: [150, 0, 0] },
];

{
	yards.map((yard, index) => <ContainerYard key={index} {...yard} />);
}
```
