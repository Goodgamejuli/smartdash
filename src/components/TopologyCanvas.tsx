import React, { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Controls,
  type Connection,
  type XYPosition,
  type Edge as FlowEdge,
  type Node as FlowNode,
  type ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useTopologyStore, type Device } from '../store/useTopologyStore';
import { ALL_DEVICE_TYPES } from '../model/deviceTypes';

const nodeTypes = {};
const initialNodes: FlowNode[] = [];
const initialEdges: FlowEdge[] = [];

const TopologyCanvasContent: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [rf, setRf] = useState<ReactFlowInstance | null>(null);

  const addDevice = useTopologyStore((s) => s.addDevice);
  const addLog = useTopologyStore((s) => s.addLog);
  const addEdgeToStore = useTopologyStore((s) => s.addEdge);
  const updateDevicePosition = useTopologyStore((s) => s.updateDevicePosition);
  const removeDeviceFromStore = useTopologyStore((s) => s.removeDevice);
  const removeEdgeFromStore = useTopologyStore((s) => s.removeEdge);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) {
        return;
      }

      const newEdge: FlowEdge = {
        id: `edge-${params.source}-${params.target}-${Date.now()}`,
        source: params.source,
        target: params.target,
      };

      setEdges((eds) => eds.concat(newEdge));
      addEdgeToStore({ id: newEdge.id, source: newEdge.source, target: newEdge.target });
      addLog(`Connected ${params.source} → ${params.target}`);
    },
    [setEdges, addLog, addEdgeToStore]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!rf) return;

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const def = ALL_DEVICE_TYPES.find((d) => d.type === type);
      if (!def) return;

      // ✅ Keine manuellen Bounds abziehen – direkt Screen→Flow
      const pos: XYPosition = rf.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newDev: Omit<Device, 'id'> = {
        type: def.type,
        label: def.label,
        x: pos.x,
        y: pos.y,
        protocols: def.protocols,
      };
      const created = addDevice(newDev);

      setNodes((nds) =>
        nds.concat({
          id: created.id,
          position: pos,
          data: { label: def.label },
        })
      );

      addLog(`Device placed: ${def.label} @ (${Math.round(pos.x)}, ${Math.round(pos.y)})`);
    },
    [rf, addDevice, addLog, setNodes]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  // ✅ Logge Positionsänderungen & schreibe sie in den Store
  const onNodeDragStop = useCallback(
    (_e: React.MouseEvent, node: FlowNode) => {
      updateDevicePosition(node.id, node.position.x, node.position.y);
      const label = (node.data as any)?.label ?? node.id;
      addLog(
        `Device moved: ${label} -> (${Math.round(node.position.x)}, ${Math.round(
          node.position.y
        )})`
      );
    },
    [updateDevicePosition, addLog]
  );

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: FlowNode) => {
      event.preventDefault();
      const label = (node.data as any)?.label ?? node.id;
      const relatedEdges = edges.filter((edge) => edge.source === node.id || edge.target === node.id);
      const shouldDelete = window.confirm(
        relatedEdges.length > 0
          ? `Delete "${label}" and ${relatedEdges.length} connected link${relatedEdges.length > 1 ? 's' : ''}?`
          : `Delete "${label}"?`
      );

      if (!shouldDelete) {
        return;
      }

      setNodes((nds) => nds.filter((n) => n.id !== node.id));
      setEdges((eds) => eds.filter((edge) => edge.source !== node.id && edge.target !== node.id));
      removeDeviceFromStore(node.id);
      relatedEdges.forEach((edge) => removeEdgeFromStore(edge.id));

      addLog(
        relatedEdges.length > 0
          ? `Deleted device ${label} (removed ${relatedEdges.length} link${relatedEdges.length > 1 ? 's' : ''})`
          : `Deleted device ${label}`
      );
    },
    [edges, setNodes, setEdges, removeDeviceFromStore, removeEdgeFromStore, addLog]
  );

  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: FlowEdge) => {
      event.preventDefault();
      const shouldDelete = window.confirm(
        `Delete connection ${edge.source} → ${edge.target}?`
      );

      if (!shouldDelete) {
        return;
      }

      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      removeEdgeFromStore(edge.id);
      addLog(`Deleted connection ${edge.source} → ${edge.target}`);
    },
    [setEdges, removeEdgeFromStore, addLog]
  );

  return (
    <div ref={wrapperRef} className="reactflow-wrapper h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeDragStop={onNodeDragStop}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onInit={setRf}
        nodeTypes={nodeTypes}
        // Optional: nimm 'fitView' raus, wenn du absolut keine Auto-Zentrierung willst
        // fitView
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
