import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly moduleRef: ModuleRef) {

  }
  onModuleInit() {
    console.log(`init`);
  }
  getHello(): string {
    return "";
    // return `Server running DB: ${this.dbConfigService.getDatabase()}`;
  }
}
