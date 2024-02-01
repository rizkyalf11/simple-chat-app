import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { JwtModule } from '@nestjs/jwt';
import { jwt_config } from 'src/config/jwt.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';

@Module({
  imports: [
    JwtModule.register(jwt_config),
    TypeOrmModule.forFeature([Message]),
  ],
  providers: [EventsGateway],
})
export class EventsModule {}
