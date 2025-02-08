import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { Public, Roles } from 'src/decorators/customize';
import { RolesGuard } from 'src/auths/guards/roles.guard';
import { JwtAuthGuard } from 'src/auths/passport/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Owner')
  async findAll(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.usersService.findAll(query, +current, +pageSize);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  findOne(@Request() req) {
    console.log(req.user._id);
    return this.usersService.findOne(req.user._id);
  }

  @Get(':username')
  findByusername(@Param(':username') username: string) {
    return this.usersService.findByUsernameOrEmail(username);
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
