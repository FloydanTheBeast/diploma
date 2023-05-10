import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { AppService } from './app.service';
import { BaseParser } from '../common/parsers/baseParser';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('COURSES_SERVICE') private readonly coursesService: ClientProxy,
    @Inject('PARSERS') private readonly parsers: BaseParser[],
  ) {}

  @Get()
  getData() {
    this.parsers.forEach(parser => parser.parse());
    return this.appService.getData();
  }
}
