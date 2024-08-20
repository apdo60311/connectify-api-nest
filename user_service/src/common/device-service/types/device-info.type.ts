export type DeviceInfo = {
    ip: string;
    browser: string;
    os: string;
    device: string;
    location: DeviceLocation;
    time: Date;
}

export type DeviceLocation = {
    city: string;
    region: string;
    country: string;
    postal: string;
    timezone: string;
}
