import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { Message } from './events/message.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwt_config } from './config/jwt.config';
import { User } from './auth/auth.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Message, User]),
    AuthModule,
    EventsModule,
    JwtModule.register(jwt_config),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
