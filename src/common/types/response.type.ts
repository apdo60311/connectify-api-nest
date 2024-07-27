import { HttpStatus } from "@nestjs/common";

export class ResponseType {
    readonly code: HttpStatus;
    readonly message: string;
    readonly time: string;
    readonly url: string;
    readonly data: any;

    constructor(code: HttpStatus, message: string, time: string, url: string, data: any) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.time = time;
        this.url = url;
    }

    toJson = () => {
        return {
            code: this.code,
            message: this.message,
            time: this.time,
            url: this.url,
            data: this.data,
        }
    }

    static fromJson = (data: any): ResponseType => new ResponseType(data['code'], data['message'], data['time'], data['url'], data['data']);
}