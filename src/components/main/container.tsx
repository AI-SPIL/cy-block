import { useState } from "react";

export interface PositionedContainer {
	position: [number, number, number];
	meshSize: [number, number, number];
	color: string;
	name: string;
}

export function Container({ container, selected, onSelect }: { container: PositionedContainer; selected: boolean; onSelect: (name: string) => void }) {
	const [hovered, setHovered] = useState(false);

	const handlePointerEnter = () => {
		setHovered(true);
	};

	const handlePointerLeave = () => {
		setHovered(false);
	};

	const handleClick = () => {
		onSelect(container.name);
	};

	return (
		<group position={container.position}>
			<mesh onClick={handleClick} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave} castShadow receiveShadow>
				<boxGeometry args={[container.meshSize[0], 3, container.meshSize[2]]} />
				<meshStandardMaterial
					color={hovered || selected ? "#ffffff" : container.color}
					transparent
					opacity={hovered ? 0.95 : selected ? 0.8 : 1.0}
					metalness={0.2}
					roughness={0.4}
					emissive={hovered ? container.color : "#000000"}
					emissiveIntensity={hovered ? 0.1 : 0}
				/>
			</mesh>

			{(hovered || selected) && (
				<mesh position={[0, 0, 0]}>
					<boxGeometry args={[container.meshSize[0] + 0.1, 3.1, container.meshSize[2] + 0.1]} />
					<meshBasicMaterial color={container.color} wireframe transparent opacity={0.8} />
				</mesh>
			)}
		</group>
	);
}
