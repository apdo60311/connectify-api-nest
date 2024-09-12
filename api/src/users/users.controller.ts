import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Controller()
export class UsersController {
    constructor(@Inject('NATS_SERVICE') private readonly natsClient: ClientProxy) { }


}