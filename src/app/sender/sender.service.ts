import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SenderEntity } from 'src/app/sender';
import { Repository } from 'typeorm';

@Injectable()
class SenderService {
  constructor(
    @InjectRepository(SenderEntity)
    private readonly senderRepo: Repository<SenderEntity>,
  ) {}

  async getOrCreateSender(email: string): Promise<SenderEntity> {
    try {
      const existingSender = await this.senderRepo.findOne({
        where: { email },
      });

      if (existingSender) {
        return existingSender;
      }

      const newSender = this.senderRepo.create({ email });
      await this.senderRepo.save(newSender);
      return newSender;
    } catch (error) {
      throw new BadRequestException(error, {
        cause: this.getOrCreateSender.name,
        description: 'Error getting or creating sender',
      });
    }
  }
}

export default SenderService;
