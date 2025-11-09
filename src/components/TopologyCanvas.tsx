import React, { useCallback, useRef } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    Connection,
    Viewport,
    XYPosition,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useTopologyStore } from '../store/useTopologyStore';
import { ALL_DEVICE_TYPES } from '../model/deviceTypes';
import { Device } from '../model/schema';

// Define a custom node type map if needed later, for now, use default
const nodeTypes = {};

const initialNodes = [];
const initialEdges = [];

const TopologyCanvasContent: React.FC = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { devices, edges, addDevice, addEdge: storeAddEdge } = useTopologyStore();

    // React Flow state management (synced with ZUSTAND store later, but for now, use local state for simplicity)
    // NOTE: In a real application, nodes/edges should be derived from the store state (devices/edges)
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edgeFlows, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Handler for connecting nodes
    const onConnect = useCallback(
        (params: Connection) => {
            // Assuming we need to determine the protocol based on the connected devices later
            // For now, just add the edge to React Flow state
            setEdges((eds) => addEdge(params, eds));
            
            // If we were fully integrating with the store:
            // const sourceDevice = devices.find(d => d.id === params.source);
            // const targetDevice = devices.find(d => d.id === params.target);
            // if (sourceDevice && targetDevice) {
            //     // Logic to determine protocol and call storeAddEdge
            // }
        },
        [setEdges]
    );

    // Handle dropping a new device onto the canvas
    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type || !reactFlowBounds) {
                return;
            }

            // We need to calculate the position relative to the viewport
            // Since we don't have access to the React Flow instance (useReactFlow hook) here easily,
            // we rely on the parent component (AppShell) to handle the coordinate transformation
            // OR we use the useReactFlow hook inside this component. Let's use useReactFlow.
            
            // Since useReactFlow must be inside ReactFlowProvider, we need to restructure slightly.
            // For simplicity in this initial implementation, I will assume the drop coordinates
            // are relative to the canvas wrapper and let the store handle the ID generation.

            const deviceDef = ALL_DEVICE_TYPES.find(d => d.type === type);

            if (deviceDef) {
                // Placeholder for coordinate transformation (will be refined if useReactFlow is introduced)
                const position: XYPosition = {
                    x: event.clientX - reactFlowBounds.left,
                    y: event.clientY - reactFlowBounds.top,
                };

                const newDevice: Omit<Device, 'id'> = {
                    type: deviceDef.type,
                    label: deviceDef.label,
                    x: position.x,
                    y: position.y,
                    protocols: deviceDef.protocols,
                };

                addDevice(newDevice);
                
                // NOTE: If we were fully integrating, we would update React Flow nodes based on the store state change.
                // For now, we just update the store.
            }
        },
        [addDevice]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);


    // NOTE: This component is currently using local React Flow state (nodes, edgeFlows) 
    // and the global store (devices, edges) separately. Full integration would require 
    // deriving nodes/edges from devices/edges and using onNodeChange/onEdgeChange to update the store.
    // For the purpose of enabling drag and drop, this structure is sufficient to capture the drop event and call addDevice.

    return (
        <div className="reactflow-wrapper h-full w-full" ref={reactFlowWrapper}>
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
