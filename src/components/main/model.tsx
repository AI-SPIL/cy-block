import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Box3, Vector3, type Mesh } from "three";

export function GLBModel({ onMeshPositionsReady }: { onMeshPositionsReady: (positions: { [key: string]: { position: [number, number, number]; size: [number, number, number] } }) => void }) {
	const { nodes } = useGLTF("/cy-block/floor.glb");
	const meshRefs = useRef<{ [key: string]: Mesh }>({});

	useEffect(() => {
		const meshNames = ["BL", "BR", "TL", "TR"];
		const positions: { [key: string]: { position: [number, number, number]; size: [number, number, number] } } = {};

		meshNames.forEach((name) => {
			const mesh = nodes[name];
			if (mesh && mesh.type === "Mesh") {
				// Get the center position and size of the mesh
				const box = new Box3().setFromObject(mesh);
				const center = new Vector3();
				box.getCenter(center);
				const size = new Vector3();
				box.getSize(size);

				positions[name] = {
					position: [center.x, center.y, center.z],
					size: [size.x, size.y, size.z],
				};
			} else {
				console.warn(`Mesh ${name} not found in GLB file`);
				// Fallback positions and sizes if mesh not found
				const fallbackData: { [key: string]: { position: [number, number, number]; size: [number, number, number] } } = {
					BL: { position: [-5, 0, -5], size: [2, 1, 2] },
					BR: { position: [5, 0, -5], size: [2, 1, 2] },
					TL: { position: [-5, 0, 5], size: [2, 1, 2] },
					TR: { position: [5, 0, 5], size: [2, 1, 2] },
				};
				positions[name] = fallbackData[name] || { position: [0, 0, 0], size: [2, 1, 2] };
			}
		});

		onMeshPositionsReady(positions);
	}, [nodes, onMeshPositionsReady]);

	return (
		<group>
			{Object.entries(nodes).map(([name, node]) => {
				if (node && node.type === "Mesh") {
					const mesh = node as Mesh;
					return (
						<mesh
							key={name}
							ref={(ref) => {
								if (ref) meshRefs.current[name] = ref;
							}}
							geometry={mesh.geometry}
							material={mesh.material}
							position={mesh.position}
							rotation={mesh.rotation}
							scale={mesh.scale}
						/>
					);
				}
				return null;
			})}
		</group>
	);
}
