import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReservationDetail } from './schemas/reservation-details.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import {
  CreateReservationDetailDto,
  UpdateReservationDetailDto,
} from './dto/reservation-detail.dto';

@Injectable()
export class ReservationDetailsService {
  constructor(
    @InjectModel(ReservationDetail.name)
    private readonly reservationDetailModel: Model<ReservationDetail>,
  ) {}

  async create(
    createReservationDetailDto: CreateReservationDetailDto,
  ): Promise<ReservationDetail> {
    const newReservationDetail = new this.reservationDetailModel(
      createReservationDetailDto,
    );
    return newReservationDetail.save();
  }

  async findAll(
    query: string = '',
    current: number = 1,
    pageSize: number = 10,
  ) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    const totalItems = await this.reservationDetailModel
      .countDocuments(filter)
      .exec();
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;

    const hasPrevious = current > 1;
    const hasNext = current < totalPages;

    const results = await this.reservationDetailModel
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

  async findOne(id: string): Promise<ReservationDetail> {
    const reservationDetail = await this.reservationDetailModel
      .findById(id)
      .exec();
    if (!reservationDetail) {
      throw new NotFoundException(`ReservationDetail with ID ${id} not found`);
    }
    return reservationDetail;
  }

  async update(
    id: string,
    updateReservationDetailDto: UpdateReservationDetailDto,
  ): Promise<ReservationDetail> {
    const updatedReservationDetail = await this.reservationDetailModel
      .findByIdAndUpdate(id, updateReservationDetailDto, { new: true })
      .exec();

    if (!updatedReservationDetail) {
      throw new NotFoundException(`ReservationDetail with ID ${id} not found`);
    }

    return updatedReservationDetail;
  }

  async remove(id: string): Promise<void> {
    const result = await this.reservationDetailModel
      .findByIdAndDelete(id)
      .exec();
    if (!result) {
      throw new NotFoundException(`ReservationDetail with ID ${id} not found`);
    }
  }
}
