import { Injectable, Logger } from '@nestjs/common';
import { getEnvVar } from 'src/config/global';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramBotService {
  private readonly bot: Telegraf;
  private readonly logger = new Logger(TelegramBotService.name);

  constructor() {
    const token = getEnvVar('TELEGRAM_BOT_TOKEN');
    this.bot = new Telegraf(token);

    this.setupBot();
  }

  private setupBot() {
    this.bot.start((ctx) => ctx.reply('Welcome to Email Assistant'));

    this.bot.command('summary', async (ctx) => {
      // Example action, can fetch email summary from DB
      await ctx.reply('Fetching your email summary... 📬');
    });

    this.bot.on('text', async (ctx) => {
      await ctx.reply(`You said: ${ctx.message.text}`);
    });
  }

  async launchWebhook() {
    const domain = getEnvVar('TELEGRAM_WEBHOOK_DOMAIN');
    const port = parseInt(getEnvVar('PORT'));
    const path = 'telegram/webhook';

    await this.bot.launch({
      webhook: {
        domain,
        port,
        hookPath: path,
      },
    });
    // this.logger.log(`Telegram bot running on webhook: ${domain}/${path}`);
  }

  getBotInstance() {
    return this.bot;
  }
}
