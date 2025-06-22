import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SenderEntity } from './entities/sender.entity';

@Injectable()
class SenderService {
  constructor(
    @InjectRepository(SenderEntity)
    private readonly senderRepo: Repository<SenderEntity>,
  ) {}

  async getOrCreateSender(email?: string): Promise<SenderEntity> {
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

  public async updateSender(sender: SenderEntity) {
    try {
      const newSender = this.senderRepo.create(sender);
      await this.senderRepo.save(newSender);
    } catch (error) {
      throw new BadRequestException(error, {
        cause: this.updateSender.name,
        description: 'Error updating sender',
      });
    }
  }
}

export default SenderService;
