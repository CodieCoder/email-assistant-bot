import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sender } from 'src/entities/email-sender.entity';
import { Repository } from 'typeorm';

@Injectable()
class SenderService {
  constructor(
    @InjectRepository(Sender)
    private readonly senderRepo: Repository<Sender>,
  ) {}

  async getOrCreateSender(email: string): Promise<Sender> {
    const existingSender = await this.senderRepo.findOne({ where: { email } });

    if (existingSender) {
      return existingSender;
    }

    const newSender = this.senderRepo.create({ email });
    await this.senderRepo.save(newSender);
    return newSender;
  }
}

export default SenderService;
