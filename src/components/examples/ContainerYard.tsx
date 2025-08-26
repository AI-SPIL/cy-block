/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { useCallback, useMemo } from 'react';
import type { ContainerInfo } from './Container';
import { Container, ContainerGrade, ContainerStatus } from './Container';

/**
 * Grid slot interface for positioning containers
 */
export interface GridSlot {
  /** Grid position (0-indexed) */
  gridX: number;
  gridY: number;
  /** Tier/stack level (0-indexed) */
  tier: number;
  /** Container information (null for empty slots) */
  container: ContainerInfo | null;
}

/**
 * Container yard configuration
 */
export interface YardConfig {
  /** Yard dimensions in grid units (e.g., 4x4 grid) */
  gridSize: {
    width: number;  // Number of grid columns
    height: number; // Number of grid rows
  };
  /** Physical dimensions in meters */
  physicalSize: {
    width: number;  // Physical width in meters
    height: number; // Physical height in meters
  };
  /** Yard position offset [x, y, z] */
  position?: [number, number, number];
  /** Background color */
  backgroundColor?: string;
  /** Grid line color */
  gridColor?: string;
  /** Maximum tiers/stacking height */
  maxTiers?: number;
}

/**
 * Container yard props
 */
export interface ContainerYardProps {
  /** Yard configuration */
  config: YardConfig;
  /** Array of grid slots containing containers */
  slots: GridSlot[];
  /** Selected container info */
  selectedContainer?: ContainerInfo | null;
  /** Container click handler */
  onContainerClick?: (container: ContainerInfo) => void;
  /** Container hover handler */
  onContainerHover?: (container: ContainerInfo | null) => void;
  /** Custom container color mapping function */
  getContainerColor?: (container: ContainerInfo) => string;
  /** Whether to show tooltips */
  showTooltips?: boolean;
  /** Camera controls enabled */
  enableControls?: boolean;
  /** Initial camera position */
  cameraPosition?: [number, number, number];
}

/**
 * Default container colors based on grade
 */
const DEFAULT_CONTAINER_COLORS = {
  [ContainerGrade.A]: '#4caf50', // Green
  [ContainerGrade.B]: '#2196f3', // Blue
  [ContainerGrade.C]: '#ff9800', // Orange
};

/**
 * Grid line component for visual reference
 */
const YardGrid: React.FC<{ config: YardConfig }> = ({ config }) => {
  const { gridSize, physicalSize, position = [0, 0, 0] } = config;

  // Calculate grid spacing
  const gridSpacingX = physicalSize.width / gridSize.width;
  const gridSpacingZ = physicalSize.height / gridSize.height;

  return (
    <group position={position}>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[physicalSize.width + 20, physicalSize.height + 20]} />
        <meshStandardMaterial
          color={config.backgroundColor || '#000000'}
          transparent
          opacity={0.9}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Grid lines */}
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
      />
    </group>
  );
};

/**
 * Enhanced Container Yard component with improved performance and flexibility
 */
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
    const worldY = tier * 1.1 + 0.5 + yardOffset[1]; // 1.1m per tier with 0.5m base height
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

/**
 * Full Container Yard Scene component with Canvas wrapper
 */
export interface ContainerYardSceneProps extends ContainerYardProps {
  /** Canvas style properties */
  style?: React.CSSProperties;
  /** Camera field of view */
  fov?: number;
  /** Lighting configuration */
  lighting?: {
    ambientIntensity?: number;
    directionalIntensity?: number;
    directionalPosition?: [number, number, number];
  };
  /** Children components to render in the scene */
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

      {/* Container Yard */}
      <ContainerYard
        config={config}
        enableControls={enableControls}
        cameraPosition={finalCameraPosition}
        {...yardProps}
      />

      {/* Additional children components */}
      {children}

      {/* Camera Controls */}
      {enableControls && (
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.2} // Prevent going below ground
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
