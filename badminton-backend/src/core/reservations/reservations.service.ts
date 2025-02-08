import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Reservation } from './schemas/reservation.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import moment from 'moment';
import { Facility } from '../facilities/schemas/facility.schema';
import { PAYMENT_STATUS } from 'src/config/type';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<Reservation>,
    @InjectModel(Facility.name)
    private readonly facilityModel: Model<Reservation>,
  ) {}

  async create(createReservationDto: CreateReservationDto) {
    const date = moment
      .utc(createReservationDto.reservationDate, 'MM/DD/YYYY')
      .toDate();

    createReservationDto.reservationDate = date;

    const newReservation = new this.reservationModel(createReservationDto);
    return newReservation.save();
  }

  async findAll(
    query: string = '',
    current: number = 1,
    pageSize: number = 10,
    keyword: string = '',
    userId?: string,
    status?: string,
  ) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    let facilityIds = [];
    if (keyword) {
      const facilities = await this.facilityModel
        .find({
          name: { $regex: keyword, $options: 'i' },
        })
        .select('_id');
      facilityIds = facilities.map((f) => f._id);
    }

    let baseQuery: any = { ...filter };

    if (keyword) {
      baseQuery.facility = { $in: facilityIds };
    }

    if (userId) {
      baseQuery.userId = userId;
    }
    console.log(status);

    if (
      status &&
      Object.values(PAYMENT_STATUS).includes(status as PAYMENT_STATUS)
    ) {
      baseQuery.status = status;
    }

    const totalItems = await this.reservationModel
      .countDocuments(baseQuery)
      .exec();

    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;

    const hasPrevious = current > 1;
    const hasNext = current < totalPages;

    const results = await this.reservationModel
      .find(baseQuery)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any)
      .populate('facility', 'name address hotline avatar')
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

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationModel.findById(id).exec();
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return reservation;
  }

  async update(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    const updatedReservation = await this.reservationModel
      .findByIdAndUpdate(id, updateReservationDto, { new: true })
      .exec();

    if (!updatedReservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    return updatedReservation;
  }

  async remove(id: string): Promise<void> {
    const result = await this.reservationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
  }
}
