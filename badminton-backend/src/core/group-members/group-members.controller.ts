import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { GroupMembersService } from './group-members.service';
import {
  CreateGroupMemberDto,
  UpdateGroupMemberDto,
} from './dto/group-meber.dto';

@Controller('group-members')
export class GroupMembersController {
  constructor(private readonly groupMembersService: GroupMembersService) {}

  @Get()
  async findAll(
    @Query('query') query: string = '',
    @Query('current') current: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.groupMembersService.findAll(query, current, pageSize);
  }

  @Post()
  async create(@Body() createGroupMemberDto: CreateGroupMemberDto) {
    return this.groupMembersService.create(createGroupMemberDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.groupMembersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGroupMemberDto: UpdateGroupMemberDto,
  ) {
    return this.groupMembersService.update(id, updateGroupMemberDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.groupMembersService.remove(id);
  }
}
