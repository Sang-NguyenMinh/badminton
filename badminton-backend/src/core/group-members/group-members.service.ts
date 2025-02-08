import { Injectable, NotFoundException } from '@nestjs/common';
import { GroupMember } from './schemas/group-member.schema';
import aqp from 'api-query-params';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateGroupMemberDto,
  UpdateGroupMemberDto,
} from './dto/group-meber.dto';

@Injectable()
export class GroupMembersService {
  constructor(
    @InjectModel(GroupMember.name)
    private readonly groupMemberModel: Model<GroupMember>,
  ) {}

  async create(
    createGroupMemberDto: CreateGroupMemberDto,
  ): Promise<GroupMember> {
    const newGroupMember = new this.groupMemberModel(createGroupMemberDto);
    return newGroupMember.save();
  }

  async findAll(
    query: string = '',
    current: number = 1,
    pageSize: number = 10,
  ) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    const totalItems = await this.groupMemberModel
      .countDocuments(filter)
      .exec();
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;

    const hasPrevious = current > 1;
    const hasNext = current < totalPages;

    const results = await this.groupMemberModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any)
      .exec();

    return {
      meta: {
        current,
        pageSize,
        pages: totalPages,
        total: totalItems,
        previous: hasPrevious,
        next: hasNext,
      },
      results,
    };
  }

  async findOne(id: string): Promise<GroupMember> {
    const groupMember = await this.groupMemberModel.findById(id).exec();
    if (!groupMember) {
      throw new NotFoundException(`GroupMember with ID ${id} not found`);
    }
    return groupMember;
  }

  async update(
    id: string,
    updateGroupMemberDto: UpdateGroupMemberDto,
  ): Promise<GroupMember> {
    const updatedGroupMember = await this.groupMemberModel
      .findByIdAndUpdate(id, updateGroupMemberDto, { new: true })
      .exec();

    if (!updatedGroupMember) {
      throw new NotFoundException(`GroupMember with ID ${id} not found`);
    }

    return updatedGroupMember;
  }

  async remove(id: string): Promise<void> {
    const result = await this.groupMemberModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`GroupMember with ID ${id} not found`);
    }
  }
}
