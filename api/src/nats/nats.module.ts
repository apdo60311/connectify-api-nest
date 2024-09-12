import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
@Module({
    imports: [
        ClientsModule.register([{
            transport: Transport.NATS,
            name: 'NATS_SERVICE',
            options: {
                servers: "nats://nats"
            }
        }])
    ],
    exports: [
        ClientsModule.register([{
            transport: Transport.NATS,
            name: 'NATS_SERVICE',
            options: {
                servers: "nats://nats"
            }
        }])
    ]

})
export class NatsModule { }
