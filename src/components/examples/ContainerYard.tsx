/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { useCallback, useMemo } from 'react';
import type { ContainerInfo } from './Container';
import { Container, ContainerGrade, ContainerStatus } from './Container';

export interface GridSlot {
  gridX: number;
  gridY: number;
  tier: number;
  container: ContainerInfo | null;
}

export interface YardConfig {
  gridSize: {
    width: number;  // Number of grid columns
    height: number; // Number of grid rows
  };
  physicalSize: {
    width: number;  // Physical width in meters
    height: number; // Physical height in meters
  };
  position?: [number, number, number];
  backgroundColor?: string;
  gridColor?: string;
  maxTiers?: number;
}

export interface ContainerYardProps {
  config: YardConfig;
  slots: GridSlot[];
  selectedContainer?: ContainerInfo | null;
  onContainerClick?: (container: ContainerInfo) => void;
  onContainerHover?: (container: ContainerInfo | null) => void;
  getContainerColor?: (container: ContainerInfo) => string;
  showTooltips?: boolean;
  enableControls?: boolean;
  cameraPosition?: [number, number, number];
}

const DEFAULT_CONTAINER_COLORS = {
  [ContainerGrade.A]: '#4caf50', // Green
  [ContainerGrade.B]: '#2196f3', // Blue
  [ContainerGrade.C]: '#ff9800', // Orange
};

const YardGrid: React.FC<{ config: YardConfig }> = ({ config }) => {
  const { gridSize, physicalSize, position = [0, 0, 0] } = config;

  // Calculate grid spacing
  const gridSpacingX = physicalSize.width / gridSize.width;
  const gridSpacingZ = physicalSize.height / gridSize.height;

  return (
    <group position={position}>
      {/* Ground plane positioned exactly at ground level */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[physicalSize.width + 10, physicalSize.height + 10]} />
        <meshStandardMaterial
          color={config.backgroundColor || '#000000'}
          transparent
          opacity={0.9}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Single grid system to prevent overlapping */}
      <Grid
        args={[physicalSize.width, physicalSize.height]}
        cellSize={Math.min(gridSpacingX, gridSpacingZ)}
        cellThickness={0.5}
        cellColor={config.gridColor || '#ffffff'}
        sectionSize={Math.max(gridSpacingX, gridSpacingZ)}
        sectionThickness={1}
        sectionColor={config.gridColor || '#ffffff'}
        fadeDistance={200}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  );
};

export const ContainerYard: React.FC<ContainerYardProps> = ({
  config,
  slots,
  selectedContainer,
  onContainerClick,
  onContainerHover,
  getContainerColor,
  showTooltips = true,
}) => {

  // Calculate grid spacing for positioning
  const gridSpacingX = config.physicalSize.width / config.gridSize.width;
  const gridSpacingZ = config.physicalSize.height / config.gridSize.height;
  const yardOffset = config.position || [0, 0, 0];

  // Default container color function
  const defaultGetContainerColor = useCallback((container: ContainerInfo): string => {
    return DEFAULT_CONTAINER_COLORS[container.grade] || '#64b5f6';
  }, []);

  const containerColorFn = getContainerColor || defaultGetContainerColor;

  // Convert grid positions to world positions
  const getWorldPosition = useCallback((gridX: number, gridY: number, tier: number): [number, number, number] => {
    const worldX = (gridX - config.gridSize.width / 2 + 0.5) * gridSpacingX + yardOffset[0];
    const worldY = tier * 1.0 + 0.1 + yardOffset[1];
    const worldZ = (gridY - config.gridSize.height / 2 + 0.5) * gridSpacingZ + yardOffset[2];

    return [worldX, worldY, worldZ];
  }, [config.gridSize, gridSpacingX, gridSpacingZ, yardOffset]);

  // Filter and memoize containers for rendering
  const containersToRender = useMemo(() => {
    return slots
      .filter(slot => slot.container && slot.container.status !== ContainerStatus.EMPTY)
      .map(slot => ({
        ...slot,
        worldPosition: getWorldPosition(slot.gridX, slot.gridY, slot.tier),
        color: containerColorFn(slot.container!),
        isSelected: selectedContainer === slot.container,
      }));
  }, [slots, getWorldPosition, containerColorFn, selectedContainer]);

  // Handle container interactions
  const handleContainerClick = useCallback((container: ContainerInfo) => {
    onContainerClick?.(container);
  }, [onContainerClick]);

  const handleContainerHover = useCallback((container: ContainerInfo | null) => {
    onContainerHover?.(container);
  }, [onContainerHover]);



  return (
    <group>
      {/* Yard grid and ground */}
      <YardGrid config={config} />

      {/* Containers */}
      {containersToRender.map((slot, index) => (
        <Container
          key={`${slot.gridX}-${slot.gridY}-${slot.tier}-${index}`}
          position={slot.worldPosition}
          info={slot.container!}
          color={slot.color}
          selected={slot.isSelected}
          onClick={handleContainerClick}
          onHover={handleContainerHover}
          showTooltip={showTooltips}
        />
      ))}
    </group>
  );
};

export interface ContainerYardSceneProps extends ContainerYardProps {
  style?: React.CSSProperties;
  fov?: number;
  lighting?: {
    ambientIntensity?: number;
    directionalIntensity?: number;
    directionalPosition?: [number, number, number];
  };
  children?: React.ReactNode;
}

export const ContainerYardScene: React.FC<ContainerYardSceneProps> = ({
  style,
  fov = 50,
  lighting = {},
  cameraPosition,
  config,
  enableControls = true,
  children,
  ...yardProps
}) => {
  const {
    ambientIntensity = 0.6,
    directionalIntensity = 0.8,
    directionalPosition = [50, 50, 25]
  } = lighting;

  // Calculate camera target (center of yard)
  const yardOffset = config.position || [0, 0, 0];
  const cameraTarget: [number, number, number] = [
    yardOffset[0],
    2,
    yardOffset[2]
  ];

  // Default camera position
  const defaultCameraPosition: [number, number, number] = [
    yardOffset[0] + config.physicalSize.width * 0.6,
    config.physicalSize.height * 0.8,
    yardOffset[2] + config.physicalSize.height * 0.6
  ];

  const finalCameraPosition = cameraPosition || defaultCameraPosition;

  return (
    <Canvas
      camera={{
        position: finalCameraPosition,
        fov
      }}
      style={{
        width: '100%',
        height: '100%',
        background: '#0d1117',
        ...style
      }}
      shadows
    >
      {/* Lighting */}
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={directionalPosition}
        intensity={directionalIntensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      <ContainerYard
        config={config}
        enableControls={enableControls}
        cameraPosition={finalCameraPosition}
        {...yardProps}
      />

      {children}

      {/* Camera Controls */}
      {enableControls && (
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.2}
          target={cameraTarget}
          zoomSpeed={0.8}
          panSpeed={0.8}
          rotateSpeed={0.5}
        />
      )}
    </Canvas>
  );
};

export default ContainerYardScene;
