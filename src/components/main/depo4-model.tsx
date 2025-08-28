import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Box3, Vector3, type Mesh } from "three";

export function Depo4GLBModel({
	onMeshPositionsReady,
}: {
	onMeshPositionsReady: (positions: {
		[key: string]: {
			position: [number, number, number];
			size: [number, number, number];
			rotation: [number, number, number];
		};
	}) => void;
}) {
	const { nodes } = useGLTF("/cy-block/3D Platform Depo 4.glb");
	const meshRefs = useRef<{ [key: string]: Mesh }>({});

	useEffect(() => {
		// Get mesh names from the GLB nodes
		const actualMeshNames = Object.keys(nodes).filter((name) => {
			const node = nodes[name];
			// Exclude the base layer mesh
			return node && node.type === "Mesh" && name !== "#BASE_LAYER";
		});

		const positions: {
			[key: string]: {
				position: [number, number, number];
				size: [number, number, number];
				rotation: [number, number, number];
			};
		} = {};

		actualMeshNames.forEach((name) => {
			const mesh = nodes[name];
			if (mesh && mesh.type === "Mesh") {
				const box = new Box3().setFromObject(mesh);
				const center = new Vector3();
				box.getCenter(center);
				const size = new Vector3();
				box.getSize(size);

				positions[name] = {
					position: [center.x, center.y, center.z],
					size: [size.x, size.y, size.z],
					rotation: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z],
				};
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
