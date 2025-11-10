// src/components/TopologyCanvas.tsx

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  type Connection,
  type XYPosition,
  type Node as FlowNode,
  type Edge as FlowEdge,
  type ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useTopologyStore } from '../store/useTopologyStore';
import { ALL_DEVICE_TYPES } from '../model/deviceTypes';
import type { Device } from '../model/schema';

// Optional: custom node types map (empty for now)
const nodeTypes = {};

const TopologyCanvasContent: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [rf, setRf] = useState<ReactFlowInstance | null>(null);

  const devices = useTopologyStore((state) => state.devices);
  const edges = useTopologyStore((state) => state.edges);
  const addDevice = useTopologyStore((state) => state.addDevice);
  const addEdgeToStore = useTopologyStore((state) => state.addEdge);
  const moveDevice = useTopologyStore((state) => state.moveDevice);
  const addLog = useTopologyStore((state) => state.addLog);

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
  const [edgeFlows, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);

  const flowNodes = useMemo<FlowNode[]>(
    () =>
      devices.map((device) => ({
        id: device.id,
        position: { x: device.x, y: device.y },
        data: { label: device.label },
        type: 'default',
      })),
    [devices]
  );

  const flowEdges = useMemo<FlowEdge[]>(
    () =>
      edges.map((edge) => ({
        id: edge.id,
        source: edge.from,
        target: edge.to,
        label: edge.protocol,
        type: 'default',
      })),
    [edges]
  );

  useEffect(() => {
    setNodes(flowNodes);
  }, [flowNodes, setNodes]);

  useEffect(() => {
    setEdges(flowEdges);
  }, [flowEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
      if (!params.source || !params.target) {
        return;
      }

      const sourceDevice = devices.find((device) => device.id === params.source);
      const targetDevice = devices.find((device) => device.id === params.target);
      const protocol =
        sourceDevice && targetDevice
          ? sourceDevice.protocols.find((candidate) =>
              targetDevice.protocols.includes(candidate)
            ) ?? 'WLAN'
          : 'WLAN';

      addEdgeToStore(params.source, params.target, protocol);
      const sourceLabel = sourceDevice?.label ?? params.source;
      const targetLabel = targetDevice?.label ?? params.target;
      addLog({
        severity: 'info',
        text: `Verbindung erstellt: ${sourceLabel} → ${targetLabel} (${protocol})`,
      });
    },
    [setEdges, addEdgeToStore, addLog, devices]
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
      if (!rf) return;

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
      const created = addDevice(newDevice);
      setNodes((nds) =>
        nds.concat({
          id: created.id,
          position,
          data: { label: created.label },
          type: 'default',
        })
      );

      addLog({
        severity: 'info',
        text: `Gerät platziert: ${deviceDef.label} @ (${Math.round(position.x)}, ${Math.round(
          position.y
        )})`,
        deviceId: created.id,
      });
    },
    [rf, setNodes, addDevice, addLog]
  );

  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: FlowNode) => {
      moveDevice(node.id, node.position.x, node.position.y);
      const label = (node.data as { label?: string } | undefined)?.label ?? node.id;
      addLog({
        severity: 'info',
        text: `Gerät verschoben: ${label} → (${Math.round(node.position.x)}, ${Math.round(
          node.position.y
        )})`,
        deviceId: node.id,
      });
    },
    [moveDevice, addLog]
  );

  return (
    <div ref={wrapperRef} className="reactflow-wrapper h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edgeFlows}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeDragStop={onNodeDragStop}
        onInit={setRf}
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
