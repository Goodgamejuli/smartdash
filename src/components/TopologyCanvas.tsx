import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge as FlowEdge,
  type EdgeChange,
  type Node as FlowNode,
  type NodeChange,
  type ReactFlowInstance,
  type XYPosition,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ALL_DEVICE_TYPES, DEVICE_CATEGORY_META } from '../model/deviceTypes';
import { PROTOCOL_META } from '../model/protocols';
import { type Device, useTopologyStore } from '../store/useTopologyStore';
import SmartDeviceNode from './nodes/SmartDeviceNode';

// Das Canvas bildet das Herzstück: Geräte werden per Drag & Drop platziert,
// React Flow kümmert sich um Positionierung, Mini-Map und Handles.
const nodeTypes = { smartDevice: SmartDeviceNode };
const initialNodes: FlowNode[] = [];
const initialEdges: FlowEdge[] = [];

const TopologyCanvasContent: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [rf, setRf] = useState<ReactFlowInstance | null>(null);

  const devices = useTopologyStore((s) => s.devices);
  const edgesInStore = useTopologyStore((s) => s.edges);
  const addDevice = useTopologyStore((s) => s.addDevice);
  const removeDevice = useTopologyStore((s) => s.removeDevice);
  const addEdgeToStore = useTopologyStore((s) => s.addEdge);
  const removeEdgeFromStore = useTopologyStore((s) => s.removeEdge);
  const updateDevicePosition = useTopologyStore((s) => s.updateDevicePosition);
  const addLog = useTopologyStore((s) => s.addLog);

  const [nodes, setNodes, onNodesChangeBase] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeBase] = useEdgesState(initialEdges);

  // Wir merken uns die Definitionen der Gerätetypen, damit wir Icons und
  // Kategorien später erneut anzeigen können.
  const deviceDefByType = useMemo(() => {
    const map = new Map(ALL_DEVICE_TYPES.map((def) => [def.type, def]));
    return map;
  }, []);

  useEffect(() => {
    setNodes(
      devices.map<FlowNode>((device) => {
        const def = deviceDefByType.get(device.type);
        return {
          id: device.id,
          type: 'smartDevice',
          position: { x: device.x, y: device.y },
          data: {
            label: device.label,
            protocols: device.protocols,
            icon: def?.icon ?? '📦',
            categoryLabel: def?.category ? DEVICE_CATEGORY_META[def.category]?.label : undefined,
          },
        };
      })
    );
  }, [devices, deviceDefByType, setNodes]);

  useEffect(() => {
    setEdges(
      edgesInStore.map<FlowEdge>((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: PROTOCOL_META[edge.protocol]?.label ?? edge.protocol,
        style: {
          stroke: PROTOCOL_META[edge.protocol]?.color ?? '#4b5563',
          strokeWidth: 2,
        },
        data: { protocol: edge.protocol },
        markerEnd: {
          type: 'arrowclosed',
          width: 18,
          height: 18,
          color: PROTOCOL_META[edge.protocol]?.color ?? '#4b5563',
        },
      }))
    );
  }, [edgesInStore, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) {
        addLog('Verbindung ohne Quelle oder Ziel wurde verworfen.');
        return;
      }

      const sourceDevice = devices.find((d) => d.id === params.source);
      const targetDevice = devices.find((d) => d.id === params.target);

      if (!sourceDevice || !targetDevice) {
        addLog('Die ausgewählten Geräte konnten nicht gefunden werden.');
        return;
      }

      const sharedProtocols = sourceDevice.protocols.filter((protocol) =>
        targetDevice.protocols.includes(protocol)
      );

      if (sharedProtocols.length === 0) {
        addLog(
          `Keine gemeinsame Verbindungsart zwischen ${sourceDevice.label} und ${targetDevice.label}.`
        );
        return;
      }

      let chosenProtocol = sharedProtocols[0];

      if (sharedProtocols.length > 1) {
        const selection = window.prompt(
          `Mehrere Protokolle verfügbar:\n${sharedProtocols
            .map(
              (protocol, index) => `${index + 1}. ${PROTOCOL_META[protocol]?.label ?? protocol}`
            )
            .join('\n')}\nBitte eine Zahl auswählen:`,
          '1'
        );

        const selectedIndex = selection ? Number(selection) - 1 : 0;
        if (Number.isNaN(selectedIndex) || !sharedProtocols[selectedIndex]) {
          addLog('Verbindungsaufbau wurde abgebrochen.');
          return;
        }
        chosenProtocol = sharedProtocols[selectedIndex];
      }

      const duplicate = edgesInStore.find(
        (edge) =>
          edge.source === params.source &&
          edge.target === params.target &&
          edge.protocol === chosenProtocol
      );
      if (duplicate) {
        addLog('Diese Verbindung existiert bereits.');
        return;
      }

      addEdgeToStore({
        source: params.source,
        target: params.target,
        protocol: chosenProtocol,
      });

      setEdges((current) =>
        addEdge(
          {
            ...params,
            label: PROTOCOL_META[chosenProtocol]?.label ?? chosenProtocol,
            data: { protocol: chosenProtocol },
          },
          current
        )
      );

      addLog(
        `Verbindung erstellt: ${sourceDevice.label} ⇄ ${targetDevice.label} über ${
          PROTOCOL_META[chosenProtocol]?.label ?? chosenProtocol
        }.`
      );
    },
    [addEdgeToStore, addLog, devices, edgesInStore, setEdges]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!rf) return;

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const def = ALL_DEVICE_TYPES.find((d) => d.type === type);
      if (!def) {
        addLog('Geräte-Typ konnte nicht gefunden werden.');
        return;
      }

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
          type: 'smartDevice',
          position: pos,
          data: {
            label: def.label,
            protocols: def.protocols,
            icon: def.icon,
            categoryLabel: DEVICE_CATEGORY_META[def.category]?.label,
          },
        })
      );

      addLog(
        `Gerät platziert: ${def.label} @ (${Math.round(pos.x)}, ${Math.round(pos.y)}) – Protokolle: ${
          def.protocols.map((p) => PROTOCOL_META[p]?.label ?? p).join(', ') || 'keine'
        }`
      );
    },
    [rf, addDevice, addLog, setNodes]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeDragStop = useCallback(
    (_e: React.MouseEvent, node: FlowNode) => {
      updateDevicePosition(node.id, node.position.x, node.position.y);
      const label = (node.data as any)?.label ?? node.id;
      addLog(
        `Gerät verschoben: ${label} → (${Math.round(node.position.x)}, ${Math.round(
          node.position.y
        )})`
      );
    },
    [updateDevicePosition, addLog]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      changes.forEach((change) => {
        if (change.type === 'remove') {
          const device = devices.find((d) => d.id === change.id);
          if (device) {
            addLog(`Gerät entfernt: ${device.label}`);
          }
          if (change.id) {
            removeDevice(change.id);
          }
        }
      });
      onNodesChangeBase(changes);
    },
    [addLog, devices, onNodesChangeBase, removeDevice]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      changes.forEach((change) => {
        if (change.type === 'remove' && change.id) {
          const edge = edgesInStore.find((e) => e.id === change.id);
          if (edge) {
            addLog(
              `Verbindung entfernt: ${edge.source} ⇄ ${edge.target} (${PROTOCOL_META[edge.protocol]?.label ?? edge.protocol})`
            );
          }
          removeEdgeFromStore(change.id);
        }
      });
      onEdgesChangeBase(changes);
    },
    [addLog, edgesInStore, onEdgesChangeBase, removeEdgeFromStore]
  );

  return (
    <div ref={wrapperRef} className="reactflow-wrapper h-full w-full bg-slate-100">
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
        proOptions={{ hideAttribution: true }}
        fitView
      >
        <MiniMap className="!bg-white/70" />
        <Controls position="top-right" />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
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
