import { HttpStatus } from "@nestjs/common";

export class ResponseType {
    readonly code: HttpStatus;
    readonly message: string;
    readonly time: string;
    readonly url: string;
    readonly data: any;
    readonly links: Array<Record<string, any>>

    constructor(code: HttpStatus, message: string, time: string, url: string, data: any, links: Array<Record<string, any>>) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.time = time;
        this.url = url;
        this.links = links ?? [];
    }

    toJson = () => {
        return {
            code: this.code,
            message: this.message,
            time: this.time,
            url: this.url,
            data: this.data,
            links: this.links
        }
    }

    static fromJson = (data: any): ResponseType => new ResponseType(data['code'], data['message'], data['time'], data['url'], data['data'], data['links']);
}