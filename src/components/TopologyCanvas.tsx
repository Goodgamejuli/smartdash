import React, { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
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
  const updateDevicePosition = useTopologyStore((s) => s.updateDevicePosition);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
      if (params.source && params.target) {
        addLog(`Connected ${params.source} → ${params.target}`);
      }
    },
    [setEdges, addLog]
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
