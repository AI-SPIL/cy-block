import React, { useState } from 'react';
import { ContainerYardScene } from './ContainerYard';
import type { GridSlot, YardConfig } from './ContainerYard';
import { ContainerSize, ContainerStatus, ContainerGrade } from './Container';
import type { ContainerInfo } from './Container';

/**
 * Example Container Yard Component
 * 
 * This component demonstrates how to use the ContainerYard system with sample data.
 * It creates a 4x4 grid yard with both 20ft and 40ft containers as specified in the requirements.
 * 
 * Features:
 * - 100x100 meter yard with black background
 * - 4x4 grid system with white borders
 * - Mix of 20ft and 40ft containers
 * - Interactive tooltips with enhanced information
 * - Proper z-index handling for UI elements
 * - Seamless performance optimization
 */

/**
 * Generate sample container data for demonstration
 */
const generateSampleContainers = (): GridSlot[] => {
  const slots: GridSlot[] = [];
  
  // Sample container data with mix of 20ft and 40ft containers
  const sampleContainers: Array<{
    gridX: number;
    gridY: number;
    tier: number;
    info: ContainerInfo;
  }> = [
    // Row 1
    {
      gridX: 0, gridY: 0, tier: 0,
      info: {
        code: 'DEMO2001234',
        vesselVoyage: 'MSC-VESSEL-001',
        size: ContainerSize.TWENTY_FOOT,
        grade: ContainerGrade.A,
        status: ContainerStatus.OCCUPIED,
        metadata: {
          weight: 15.5,
          destination: 'Los Angeles',
          contents: 'Electronics',
          owner: 'TechCorp Ltd',
          arrivalDate: '2024-01-15'
        }
      }
    },
    {
      gridX: 1, gridY: 0, tier: 0,
      info: {
        code: 'DEMO4001235',
        vesselVoyage: 'COSCO-VESSEL-002',
        size: ContainerSize.FORTY_FOOT,
        grade: ContainerGrade.B,
        status: ContainerStatus.OCCUPIED,
        metadata: {
          weight: 28.3,
          destination: 'New York',
          contents: 'Automotive Parts',
          owner: 'AutoParts Inc',
          arrivalDate: '2024-01-16'
        }
      }
    },
    {
      gridX: 2, gridY: 0, tier: 0,
      info: {
        code: 'DEMO2001236',
        vesselVoyage: 'MAERSK-VESSEL-003',
        size: ContainerSize.TWENTY_FOOT,
        grade: ContainerGrade.C,
        status: ContainerStatus.OCCUPIED,
        metadata: {
          weight: 12.8,
          destination: 'Miami',
          contents: 'Textiles',
          owner: 'Fashion Hub',
          arrivalDate: '2024-01-17'
        }
      }
    },
    {
      gridX: 3, gridY: 0, tier: 0,
      info: {
        code: 'DEMO4001237',
        vesselVoyage: 'EVERGREEN-004',
        size: ContainerSize.FORTY_FOOT,
        grade: ContainerGrade.A,
        status: ContainerStatus.OCCUPIED,
        metadata: {
          weight: 32.1,
          destination: 'Seattle',
          contents: 'Machinery',
          owner: 'Industrial Corp',
          arrivalDate: '2024-01-18'
        }
      }
    },

    // Row 2 with some stacked containers
    {
      gridX: 0, gridY: 1, tier: 0,
      info: {
        code: 'DEMO4001238',
        vesselVoyage: 'CMA-CGM-005',
        size: ContainerSize.FORTY_FOOT,
        grade: ContainerGrade.B,
        status: ContainerStatus.OCCUPIED,
        metadata: {
          weight: 25.7,
          destination: 'Houston',
          contents: 'Chemical Products',
          owner: 'ChemCorp',
          arrivalDate: '2024-01-19'
        }
      }
    },
    {
      gridX: 0, gridY: 1, tier: 1,
      info: {
        code: 'DEMO4001239',
        vesselVoyage: 'CMA-CGM-005',
        size: ContainerSize.FORTY_FOOT,
        grade: ContainerGrade.A,
        status: ContainerStatus.OCCUPIED,
        metadata: {
          weight: 22.4,
          destination: 'Houston',
          contents: 'Pharmaceuticals',
          owner: 'PharmaInc',
          arrivalDate: '2024-01-19'
        }
      }
    },
    {
      gridX: 1, gridY: 1, tier: 0,
      info: {
        code: 'DEMO2001240',
        vesselVoyage: 'HAPAG-LLOYD-006',
        size: ContainerSize.TWENTY_FOOT,
        grade: ContainerGrade.C,
        status: ContainerStatus.OCCUPIED,
        metadata: {
          weight: 18.9,
          destination: 'Boston',
          contents: 'Food Products',
          owner: 'FoodDistrib',
          arrivalDate: '2024-01-20'
        }
      }
    },
    {
      gridX: 2, gridY: 1, tier: 0,
      info: {
        code: 'DEMO2001241',
        vesselVoyage: 'YANG-MING-007',
        size: ContainerSize.TWENTY_FOOT,
        grade: ContainerGrade.B,
        status: ContainerStatus.OCCUPIED,
        metadata: {
          weight: 14.2,
          destination: 'Portland',
          contents: 'Paper Products',
          owner: 'Paper Mills',
          arrivalDate: '2024-01-21'
        }
      }
    },

    // Row 3
    {
      gridX: 0, gridY: 2, tier: 0,
      info: {
        code: 'DEMO2001242',
        vesselVoyage: 'MOL-VESSEL-008',
        size: ContainerSize.TWENTY_FOOT,
        grade: ContainerGrade.A,
        status: ContainerStatus.RESERVED,
        metadata: {
          weight: 16.8,
          destination: 'San Francisco',
          contents: 'Consumer Goods',
          owner: 'RetailCorp',
          arrivalDate: '2024-01-22'
        }
      }
    },
    {
      gridX: 1, gridY: 2, tier: 0,
      info: {
        code: 'DEMO4001243',
        vesselVoyage: 'OOCL-VESSEL-009',
        size: ContainerSize.FORTY_FOOT,
        grade: ContainerGrade.A,
        status: ContainerStatus.OCCUPIED,
        metadata: {
          weight: 30.5,
          destination: 'Long Beach',
          contents: 'Construction Materials',
          owner: 'BuildCorp',
          arrivalDate: '2024-01-23'
        }
      }
    },
    {
      gridX: 2, gridY: 2, tier: 0,
      info: {
        code: 'DEMO2001244',
        vesselVoyage: 'K-LINE-010',
        size: ContainerSize.TWENTY_FOOT,
        grade: ContainerGrade.C,
        status: ContainerStatus.OCCUPIED,
        metadata: {
          weight: 13.6,
          destination: 'Oakland',
          contents: 'Sporting Goods',
          owner: 'Sports Inc',
          arrivalDate: '2024-01-24'
        }
      }
    },
    {
      gridX: 3, gridY: 2, tier: 0,
      info: {
        code: 'DEMO4001245',
        vesselVoyage: 'HYUNDAI-011',
        size: ContainerSize.FORTY_FOOT,
        grade: ContainerGrade.B,
        status: ContainerStatus.MAINTENANCE,
        metadata: {
          weight: 26.7,
          destination: 'San Diego',
          contents: 'Heavy Machinery',
          owner: 'MachCorp',
          arrivalDate: '2024-01-25'
        }
      }
    },

    // Row 4 with some empty slots
    {
      gridX: 1, gridY: 3, tier: 0,
      info: {
        code: 'DEMO2001246',
        vesselVoyage: 'PIL-VESSEL-012',
        size: ContainerSize.TWENTY_FOOT,
        grade: ContainerGrade.A,
        status: ContainerStatus.OCCUPIED,
        metadata: {
          weight: 17.3,
          destination: 'Tacoma',
          contents: 'Medical Equipment',
          owner: 'MedTech',
          arrivalDate: '2024-01-26'
        }
      }
    },
    {
      gridX: 2, gridY: 3, tier: 0,
      info: {
        code: 'DEMO4001247',
        vesselVoyage: 'ZIM-VESSEL-013',
        size: ContainerSize.FORTY_FOOT,
        grade: ContainerGrade.B,
        status: ContainerStatus.OCCUPIED,
        metadata: {
          weight: 29.1,
          destination: 'Charleston',
          contents: 'Agricultural Products',
          owner: 'AgriCorp',
          arrivalDate: '2024-01-27'
        }
      }
    }
  ];

  // Convert to GridSlot format
  sampleContainers.forEach(({ gridX, gridY, tier, info }) => {
    slots.push({
      gridX,
      gridY,
      tier,
      container: info
    });
  });

  return slots;
};

/**
 * Example Container Yard with 4x4 grid and sample data
 */
export const ExampleYard: React.FC = () => {
  const [selectedContainer, setSelectedContainer] = useState<ContainerInfo | null>(null);

  // Yard configuration: 100x100m with 4x4 grid
  const yardConfig: YardConfig = {
    gridSize: {
      width: 4,
      height: 4
    },
    physicalSize: {
      width: 100,  // 100 meters
      height: 100  // 100 meters
    },
    position: [0, 0, 0],
    backgroundColor: '#000000', // Black background as requested
    gridColor: '#ffffff',       // White grid lines as requested
    maxTiers: 3
  };

  // Generate sample container data
  const containerSlots = generateSampleContainers();

  // Custom container color mapping based on status and grade - matching reference image
  const getContainerColor = (container: ContainerInfo): string => {
    // Color by status first
    switch (container.status) {
      case ContainerStatus.OCCUPIED:
        // Then by grade with colors closer to reference
        switch (container.grade) {
          case ContainerGrade.A: return '#00dd88'; // Bright green
          case ContainerGrade.B: return '#0099ff'; // Bright blue  
          case ContainerGrade.C: return '#ff8800'; // Orange
        }
        break;
      case ContainerStatus.RESERVED: return '#aa44ff'; // Purple
      case ContainerStatus.MAINTENANCE: return '#ff4444'; // Red
      case ContainerStatus.EMPTY: return '#666666'; // Gray
    }
    return '#0099ff'; // Default bright blue
  };

  const handleContainerClick = (container: ContainerInfo) => {
    setSelectedContainer(container === selectedContainer ? null : container);
    console.log('Container clicked:', container);
  };

  const handleContainerHover = (container: ContainerInfo | null) => {
    // Handle container hover for future functionality
    console.log('Container hovered:', container?.code || 'none');
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <ContainerYardScene
        config={yardConfig}
        slots={containerSlots}
        selectedContainer={selectedContainer}
        onContainerClick={handleContainerClick}
        onContainerHover={handleContainerHover}
        getContainerColor={getContainerColor}
        showTooltips={true}
        enableControls={true}
        fov={50}
        lighting={{
          ambientIntensity: 0.6,
          directionalIntensity: 0.8,
          directionalPosition: [50, 50, 25]
        }}
        style={{
          background: 'linear-gradient(to bottom, #0f1419 0%, #000000 100%)',
        }}
      />

      {/* Info Panel */}
      {selectedContainer && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            minWidth: '300px',
            fontSize: '14px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            border: `3px solid ${getContainerColor(selectedContainer)}`,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', color: getContainerColor(selectedContainer) }}>
            Selected Container
          </h3>
          <div><strong>Code:</strong> {selectedContainer.code}</div>
          <div><strong>Size:</strong> {selectedContainer.size}</div>
          <div><strong>Grade:</strong> {selectedContainer.grade}</div>
          <div><strong>Status:</strong> {selectedContainer.status}</div>
          {selectedContainer.vesselVoyage && (
            <div><strong>Vessel:</strong> {selectedContainer.vesselVoyage}</div>
          )}
          {selectedContainer.metadata && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #333' }}>
              {selectedContainer.metadata.weight && (
                <div><strong>Weight:</strong> {selectedContainer.metadata.weight} tons</div>
              )}
              {selectedContainer.metadata.destination && (
                <div><strong>Destination:</strong> {selectedContainer.metadata.destination}</div>
              )}
              {selectedContainer.metadata.contents && (
                <div><strong>Contents:</strong> {selectedContainer.metadata.contents}</div>
              )}
            </div>
          )}
          <button
            onClick={() => setSelectedContainer(null)}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: `2px solid ${getContainerColor(selectedContainer)}`,
              color: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* Status Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '12px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
        }}
      >
        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Legend</div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#00dd88', marginRight: '8px' }}></div>
          Grade A
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#0099ff', marginRight: '8px' }}></div>
          Grade B
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#ff8800', marginRight: '8px' }}></div>
          Grade C
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#aa44ff', marginRight: '8px' }}></div>
          Reserved
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#ff4444', marginRight: '8px' }}></div>
          Maintenance
        </div>
      </div>

      {/* Instructions */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '12px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          maxWidth: '200px'
        }}
      >
        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Controls</div>
        <div>• Click containers to select</div>
        <div>• Hover for detailed info</div>
        <div>• Drag to rotate view</div>
        <div>• Scroll to zoom</div>
        <div>• Right-click + drag to pan</div>
      </div>
    </div>
  );
};

export default ExampleYard;
