import { Injectable, NotFoundException } from '@nestjs/common';
import aqp from 'api-query-params';
import { Friendship } from './schemas/friendship.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFriendshipDto, UpdateFriendshipDto } from './dto/friendship.dto';

@Injectable()
export class FriendshipsService {
  constructor(
    @InjectModel(Friendship.name)
    private readonly friendshipModel: Model<Friendship>,
  ) {}

  async create(createFriendshipDto: CreateFriendshipDto): Promise<Friendship> {
    const newFriendship = new this.friendshipModel(createFriendshipDto);
    return newFriendship.save();
  }

  async findAll(
    query: string = '',
    current: number = 1,
    pageSize: number = 10,
  ) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    const totalItems = await this.friendshipModel.countDocuments(filter).exec();
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;

    const hasPrevious = current > 1;
    const hasNext = current < totalPages;

    const results = await this.friendshipModel
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

  async findOne(id: string): Promise<Friendship> {
    const friendship = await this.friendshipModel.findById(id).exec();
    if (!friendship) {
      throw new NotFoundException(`Friendship with ID ${id} not found`);
    }
    return friendship;
  }

  async update(
    id: string,
    updateFriendshipDto: UpdateFriendshipDto,
  ): Promise<Friendship> {
    const updatedFriendship = await this.friendshipModel
      .findByIdAndUpdate(id, updateFriendshipDto, { new: true })
      .exec();

    if (!updatedFriendship) {
      throw new NotFoundException(`Friendship with ID ${id} not found`);
    }

    return updatedFriendship;
  }

  async remove(id: string): Promise<void> {
    const result = await this.friendshipModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Friendship with ID ${id} not found`);
    }
  }
}
