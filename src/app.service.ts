import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {

  }
  getHello(): string {
    return "";
    // return `Server running DB: ${this.dbConfigService.getDatabase()}`;
  }
}
