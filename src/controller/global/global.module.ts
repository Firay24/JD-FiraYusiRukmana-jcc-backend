import { Module } from '@nestjs/common';
import { Get, Controller } from '@nestjs/common';
// import { ProfileController } from './profile/profile.controller';

@Controller() // The default route is '/'
class GlobalController {
  @Get()
  getApiWorked(): string {
    return 'api worked';
  }
}
@Module({
  controllers: [GlobalController],
})
export class GlobalModule {}
