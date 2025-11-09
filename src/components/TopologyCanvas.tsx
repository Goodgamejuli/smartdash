// src/components/TopologyCanvas.tsx

import React, { useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  type Connection,
  type XYPosition,
  type Node,
  type Edge,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useTopologyStore } from '../store/useTopologyStore';
import { ALL_DEVICE_TYPES } from '../model/deviceTypes';
import type { Device } from '../model/schema';

// Optional: custom node types map (empty for now)
const nodeTypes = {};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const TopologyCanvasContent: React.FC = () => {
  const rf = useReactFlow();

  // pull only what you need from your store for now
  const { addDevice /*, addEdge: storeAddEdge, devices, edges */ } = useTopologyStore();

  // local UI state (we'll sync with store later)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edgeFlows, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
      // later: also persist to store if desired
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const deviceDef = ALL_DEVICE_TYPES.find((d) => d.type === type);
      if (!deviceDef) return;

      // translate screen -> flow coords (handles zoom/pan correctly)
      const position: XYPosition = rf.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // store model
      const newDevice: Omit<Device, 'id'> = {
        type: deviceDef.type,
        label: deviceDef.label,
        x: position.x,
        y: position.y,
        protocols: deviceDef.protocols,
      };
      addDevice(newDevice);

      // immediate UI feedback with a temp node
      const tempId = `${deviceDef.type}-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
      setNodes((nds) =>
        nds.concat({
          id: tempId,
          position,
          data: { label: deviceDef.label },
          type: 'default',
        })
      );
    },
    [rf, setNodes, addDevice]
  );

  return (
    <div className="reactflow-wrapper h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edgeFlows}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
      </ReactFlow>
    </div>
  );
};

const TopologyCanvas: React.FC = () => (
  <ReactFlowProvider>
    <TopologyCanvasContent />
  </ReactFlowProvider>
);

export default TopologyCanvas;
