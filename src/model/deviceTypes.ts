import { Protocol } from './schema';

export type DeviceTypeDef = {
  type: string;
  label: string;
  protocols: Protocol[];
};

// This list defines all supported device types along with their default
// connection protocols. You can extend or modify this array to fit your
// own smart-home setup.
export const DEVICE_TYPES: DeviceTypeDef[] = [
  { type: 'amazon-echo-show-15', label: 'Amazon Echo Show 15', protocols: ['WLAN'] },
  { type: 'bosch-controller', label: 'Bosch Smart Home Controller', protocols: ['ZigBee', 'Ethernet'] },
  { type: 'bosch-smoke', label: 'Bosch Feuermelder', protocols: ['ZigBee'] },
  { type: 'bosch-motion', label: 'Bosch Bewegungssensor', protocols: ['ZigBee'] },
  { type: 'bosch-contact', label: 'Bosch Kontaktsensor', protocols: ['ZigBee'] },
  { type: 'bosch-camera', label: 'Bosch Innenraumkamera', protocols: ['WLAN'] },
  { type: 'bosch-water', label: 'Bosch Wassersensor', protocols: ['ZigBee'] },
  { type: 'burgwaechter-plug', label: 'Burgwächter Smart Steckdose', protocols: ['WLAN'] },
  { type: 'thermomix', label: 'Thermomix', protocols: ['WLAN'] },
  { type: 'fairphone-4', label: 'Fairphone 4 Handy', protocols: ['WLAN', 'BLE'] },
  { type: 'pixel-7a', label: 'Google Pixel 7a Handy', protocols: ['WLAN', 'BLE'] },
  { type: 'firewall-opensense', label: 'Firewall OpenSense', protocols: ['Ethernet'] },
  { type: 'switch-nuclean', label: 'Switch nuclean d-link', protocols: ['Ethernet'] },
  { type: 'fritzbox-router', label: 'Fritzbox Router (AP)', protocols: ['WLAN', 'DECT', 'Ethernet'] },
  { type: 'fritzbox-gateway', label: 'Fritzbox Smart Gateway', protocols: ['DECT', 'Ethernet'] },
  { type: 'fritzbox-plug', label: 'Fritzbox Steckdose', protocols: ['DECT'] },
  { type: 'hama-camera', label: 'Hama Innenraumkamera', protocols: ['WLAN'] },
  { type: 'homematic-controller', label: 'Homematic Smart Home Controller', protocols: ['Homematic'] },
  { type: 'homematic-plug', label: 'Homematic Smarte Steckdose', protocols: ['Homematic'] },
  { type: 'homematic-smoke', label: 'Homematic Rauchmelder', protocols: ['Homematic'] },
  { type: 'homematic-motion', label: 'Homematic Bewegungsmelder', protocols: ['Homematic'] },
  { type: 'jura8', label: 'Jura 8 Kaffeemachine', protocols: ['WLAN'] },
  { type: 'openhab-nuc', label: 'OpenHAB auf Intel NUC', protocols: ['Ethernet'] },
  { type: 'hue-lamp', label: 'Phillips Hue Stehlampe mit Akku', protocols: ['ZigBee'] },
  { type: 'hue-motion', label: 'Phillips Hue Bewegungssensor', protocols: ['ZigBee'] },
  { type: 'ring-camera', label: 'Ring Innenraumkamera', protocols: ['WLAN'] },
  { type: 'roborock', label: 'Staubsauger Roborock 8', protocols: ['WLAN'] },
  { type: 'switchbot-controller', label: 'Switchbot Smart Home Controller', protocols: ['BLE', 'WLAN'] },
  { type: 'switchbot-contact', label: 'Switchbot Kontaktsensor', protocols: ['BLE'] },
  { type: 'withings-scale', label: 'Withings Smarte Körperwaage', protocols: ['WLAN', 'BLE'] },
  { type: 'yale-lock', label: 'Yale Smartes Türschloss', protocols: ['BLE', 'WLAN'] },
  { type: 'yale-gateway', label: 'Yale Gateway', protocols: ['BLE', 'WLAN'] },
  { type: 'oralb-brush', label: 'OralB Smarte Zahnbürste', protocols: ['BLE'] },
  { type: 'abus-bike-lock', label: 'Abus Fahrradschloss', protocols: ['BLE'] },
  { type: 'tapo-plug', label: 'Tapo Smart Home Steckdose', protocols: ['WLAN'] },
  { type: 'laptop', label: 'Laptop', protocols: ['WLAN', 'Ethernet'] },
  { type: 'levoit-air', label: 'Luftfilter Levoit', protocols: ['WLAN'] },
  { type: 'cloud-vendor', label: 'Clouds der Hersteller', protocols: ['Ethernet'] },
  { type: 'aws-cloud', label: 'AWS-Cloud', protocols: ['Ethernet'] },
  { type: 'garmin-watch', label: 'Garmin Smart Watch', protocols: ['BLE', 'WLAN'] },
  { type: 'sd-card', label: 'Lokaler SD-Kartenspeicher', protocols: ['BLE'] },
];
