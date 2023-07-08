import { Controller, Get, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Query('code') code: string): Promise<string> {
    if (!code) {
      return 'No code'
    }
    return await this.appService.getToken(code)
  }
}
