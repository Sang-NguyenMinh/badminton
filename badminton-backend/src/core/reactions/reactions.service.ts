import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { Reaction } from './schemas/reaction.schema';
import aqp from 'api-query-params';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectModel(Reaction.name) private readonly reactionModel: Model<Reaction>,
  ) {}

  async create(createReactionDto: CreateReactionDto): Promise<Reaction> {
    const newReaction = new this.reactionModel(createReactionDto);
    return newReaction.save();
  }

  async findAll(
    query: string = '',
    current: number = 1,
    pageSize: number = 10,
  ) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    const totalItems = await this.reactionModel.countDocuments(filter).exec();
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;

    const hasPrevious = current > 1;
    const hasNext = current < totalPages;

    const results = await this.reactionModel
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

  async findOne(id: string): Promise<Reaction> {
    const reaction = await this.reactionModel.findById(id).exec();
    if (!reaction) {
      throw new NotFoundException(`Reaction with ID ${id} not found`);
    }
    return reaction;
  }

  async update(
    id: string,
    updateReactionDto: UpdateReactionDto,
  ): Promise<Reaction> {
    const updatedReaction = await this.reactionModel
      .findByIdAndUpdate(id, updateReactionDto, { new: true })
      .exec();

    if (!updatedReaction) {
      throw new NotFoundException(`Reaction with ID ${id} not found`);
    }

    return updatedReaction;
  }

  async remove(id: string): Promise<void> {
    const result = await this.reactionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Reaction with ID ${id} not found`);
    }
  }
}
