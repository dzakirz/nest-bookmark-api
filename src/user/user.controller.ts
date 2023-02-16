import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Get('me')
  getMe() {
    return 'user info';
  }
}
