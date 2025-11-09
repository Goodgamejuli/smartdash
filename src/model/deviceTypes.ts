import { Protocol } from './schema';
import {
    PROTOCOL_WLAN,
    PROTOCOL_ZIGBEE,
    PROTOCOL_HOMEMATIC_PROPRIETARY,
    PROTOCOL_BLE,
    PROTOCOL_DECT,
    PROTOCOL_ETHERNET,
} from './protocols';

export type DeviceTypeDef = {
    type: string;
    label: string;
    protocols: Protocol[];
};

export const ALL_DEVICE_TYPES: DeviceTypeDef[] = [
    // Controllers/Gateways
    { type: 'echo_show_15', label: 'Amazon Echo Show 15', protocols: [PROTOCOL_WLAN] },
    { type: 'bosch_controller', label: 'Bosch Smart Home Controller', protocols: [PROTOCOL_WLAN, PROTOCOL_ETHERNET] },
    { type: 'fritzbox_gateway', label: 'Fritzbox Smart Gateway', protocols: [PROTOCOL_DECT, PROTOCOL_WLAN, PROTOCOL_ETHERNET] },
    { type: 'homematic_controller', label: 'Homematic Smart Home Controller', protocols: [PROTOCOL_HOMEMATIC_PROPRIETARY, PROTOCOL_ETHERNET] },
    { type: 'switchbot_controller', label: 'Switchbot Smart Home Controller', protocols: [PROTOCOL_BLE] },
    { type: 'yale_gateway', label: 'Yale Gateway', protocols: [PROTOCOL_WLAN, PROTOCOL_BLE] },
    { type: 'openhab_nuc', label: 'OpenHAB on Intel NUC', protocols: [PROTOCOL_ETHERNET] },

    // Sensors/Actuators
    { type: 'bosch_fire_alarm', label: 'Bosch Feuermelder', protocols: [PROTOCOL_ZIGBEE] },
    { type: 'bosch_motion_sensor', label: 'Bosch Bewegungssensor', protocols: [PROTOCOL_ZIGBEE] },
    { type: 'bosch_contact_sensor', label: 'Bosch Kontaktsensor', protocols: [PROTOCOL_ZIGBEE] },
    { type: 'bosch_water_sensor', label: 'Bosch Wassersensor', protocols: [PROTOCOL_ZIGBEE] },
    { type: 'burgwachter_socket', label: 'Burgwächter Smart Steckdose', protocols: [PROTOCOL_WLAN] },
    { type: 'fritzbox_socket', label: 'Fritzbox Steckdose', protocols: [PROTOCOL_DECT] },
    { type: 'homematic_socket', label: 'Homematic Smarte Steckdose', protocols: [PROTOCOL_HOMEMATIC_PROPRIETARY] },
    { type: 'homematic_smoke_detector', label: 'Homematic Rauchmelder', protocols: [PROTOCOL_HOMEMATIC_PROPRIETARY] },
    { type: 'homematic_motion_detector', label: 'Homematic Bewegungsmelder', protocols: [PROTOCOL_HOMEMATIC_PROPRIETARY] },
    { type: 'hue_lamp', label: 'Phillips Hue Stehlampe', protocols: [PROTOCOL_ZIGBEE, PROTOCOL_BLE] },
    { type: 'hue_motion_sensor', label: 'Phillips Hue Bewegungssensor', protocols: [PROTOCOL_ZIGBEE] },
    { type: 'switchbot_contact_sensor', label: 'Switchbot Kontaktsensor', protocols: [PROTOCOL_BLE] },
    { type: 'yale_door_lock', label: 'Yale Smartes Türschloss', protocols: [PROTOCOL_BLE] },
    { type: 'tapo_socket', label: 'Tapo Smart Home Steckdose', protocols: [PROTOCOL_WLAN] },

    // Cameras
    { type: 'bosch_camera', label: 'Bosch Innenraumkamera', protocols: [PROTOCOL_WLAN] },
    { type: 'hama_camera', label: 'Hama Innenraumkamera', protocols: [PROTOCOL_WLAN] },
    { type: 'ring_camera', label: 'Ring Innenraumkamera', protocols: [PROTOCOL_WLAN] },

    // Appliances/Misc
    { type: 'thermomix', label: 'Thermomix', protocols: [PROTOCOL_WLAN] },
    { type: 'jura_coffee', label: 'Jura 8 Kaffeemachiene', protocols: [PROTOCOL_WLAN] },
    { type: 'roborock_vacuum', label: 'Staubsauger Roborock 8', protocols: [PROTOCOL_WLAN] },
    { type: 'levoit_air_filter', label: 'Luftfilter Levoit', protocols: [PROTOCOL_WLAN] },
    { type: 'withings_scale', label: 'Withings Smarte Körperwaage', protocols: [PROTOCOL_WLAN, PROTOCOL_BLE] },
    { type: 'oralb_toothbrush', label: 'OralB Smarte Zahnbürste', protocols: [PROTOCOL_BLE] },
    { type: 'abus_lock', label: 'Abus Fahrradschloss', protocols: [PROTOCOL_BLE] },

    // Computing/Network Infrastructure
    { type: 'fairphone_4', label: 'Fairphone 4 Handy', protocols: [PROTOCOL_WLAN, PROTOCOL_BLE] },
    { type: 'pixel_7a', label: 'Google Pixel 7a Handy', protocols: [PROTOCOL_WLAN, PROTOCOL_BLE] },
    { type: 'firewall_opensense', label: 'Firewall OpenSense', protocols: [PROTOCOL_ETHERNET] },
    { type: 'switch_dlink', label: 'Switch nuclean d-link', protocols: [PROTOCOL_ETHERNET] },
    { type: 'fritzbox_ap', label: 'Fritzbox Router (Access Point)', protocols: [PROTOCOL_WLAN, PROTOCOL_ETHERNET] },
    { type: 'laptop', label: 'Laptop', protocols: [PROTOCOL_WLAN, PROTOCOL_ETHERNET, PROTOCOL_BLE] },
    { type: 'garmin_watch', label: 'Garmin Smart Watch', protocols: [PROTOCOL_BLE] },

    // External/Cloud
    { type: 'generic_cloud', label: 'Clouds der Hersteller', protocols: [PROTOCOL_WLAN, PROTOCOL_ETHERNET] },
    { type: 'aws_cloud', label: 'AWS-Cloud', protocols: [PROTOCOL_WLAN, PROTOCOL_ETHERNET] },
];
