import { Injectable, Req } from '@nestjs/common';
import { Request } from 'express';
import * as axios from "axios";
import { DeviceInfo, DeviceLocation } from './types/device-info.type';
@Injectable()
export class DeviceService {
    detectDevice(@Req() request: Request): any {
        const deviceInfo = this.parseUserRequest(request);
        return deviceInfo;
    }

    private async parseUserRequest(@Req() request: Request): Promise<DeviceInfo> {


        const ip = request.ip || 'Unkown';
        const userAgent = request.headers['user-agent'] || 'Unknown';
        let device = 'Unknown';
        let os = 'Unknown';
        let browser = 'Unknown';

        const fetchLocation = (await axios.get(`https://ipapi.co/${ip}k/json/`))

        let location: DeviceLocation;

        if (fetchLocation.status === 200) {
            const locationData = fetchLocation.data
            location = {
                country: locationData['country_name'] || 'Unknown',
                city: locationData['city'] || 'Unknown',
                region: locationData['region'] || 'Unknown',
                postal: locationData['postal'] || 'Unknown',
                timezone: locationData['timezone'] || 'Unknown'
            }
        }

        if (userAgent.includes('Mobi')) {
            device = 'Mobile';
        } else if (userAgent.includes('Tablet')) {
            device = 'Tablet';
        } else {
            device = 'Desktop';
        }

        if (userAgent.includes('Windows NT')) {
            os = 'Windows';
        } else if (userAgent.includes('Mac OS X')) {
            os = 'Mac OS';
        } else if (userAgent.includes('Linux')) {
            os = 'Linux';
        } else if (userAgent.includes('Android')) {
            os = 'Android';
        } else if (userAgent.includes('iPhone')) {
            os = 'iOS';
        }

        if (userAgent.includes('Chrome')) {
            browser = 'Chrome';
        } else if (userAgent.includes('Firefox')) {
            browser = 'Firefox';
        } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
            browser = 'Safari';
        } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
            browser = 'Internet Explorer';
        } else if (userAgent.includes('Edge')) {
            browser = 'Edge';
        }

        return {
            ip, device, os, browser, location, time: new Date(Date.now())
        };
    }
}
