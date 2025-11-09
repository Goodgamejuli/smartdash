import React from 'react';
import { ALL_DEVICE_TYPES, DeviceTypeDef } from '../model/deviceTypes';

const DeviceItem: React.FC<{ device: DeviceTypeDef }> = ({ device }) => {
    // Setup drag functionality to allow dropping devices onto the canvas
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        // 'application/reactflow' is a common convention for React Flow nodes
        event.dataTransfer.setData('application/reactflow', device.type);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div
            className="flex items-center p-2 m-1 bg-gray-100 border border-gray-300 rounded cursor-grab hover:bg-gray-200"
            draggable
            onDragStart={handleDragStart}
        >
            {/* Placeholder Icon/Square */}
            <div className="w-4 h-4 mr-2 bg-blue-500 rounded"></div>
            <span className="text-sm">{device.label}</span>
        </div>
    );
};

const DevicePalette: React.FC = () => {
    return (
        <div className="p-2 bg-white border-r border-gray-200 shadow-lg h-full overflow-y-auto">
            <h3 className="mb-2 text-lg font-semibold">Device Palette</h3>
            {ALL_DEVICE_TYPES.map((device) => (
                <DeviceItem key={device.type} device={device} />
            ))}
        </div>
    );
};

export default DevicePalette;
