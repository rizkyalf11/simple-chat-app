import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './events/message.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { jwt_config } from './config/jwt.config';
import { User } from './auth/auth.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Message) private msgRepo: Repository<Message>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async getMessage(idUser: number, token: string) {
    const user = this.jwtService.verify(token, { secret: jwt_config.secret });
    const ourUserId = user.id;

    const msg = await this.msgRepo
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .addSelect(['sender.id']) // Pilih kolom yang diinginkan dari sender
      .leftJoinAndSelect('message.recipient', 'recipient')
      .addSelect(['recipient.id']) // Pilih kolom yang diinginkan dari recipient
      .where(
        '(message.sender.id = :userId AND message.recipient.id = :ourUserId) OR (message.sender.id = :ourUserId AND message.recipient.id = :userId)',
        { userId: idUser, ourUserId },
      )
      .orderBy('message.createdAt', 'ASC')
      .getMany();

    return { message: msg };
  }

  async getPeople() {
    const users = this.userRepo.find({
      select: {
        id: true,
        username: true,
      },
    });

    return users;
  }
}
