import React from 'react';
import TerminalLayout from './TerminalLayout';

/**
 * Demo component showing the new Container Terminal Layout system
 * 
 * This demonstrates:
 * - 3x3 block arrangement like the provided diagram
 * - Small blocks for 20ft containers
 * - Large blocks for 40ft containers
 * - Random empty and occupied slots
 * - Empty slots show white borders only
 * - Enhanced tooltips with consistent size
 * - Professional container terminal visualization
 */
export const Demo: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <TerminalLayout />
    </div>
  );
};

export default Demo;
