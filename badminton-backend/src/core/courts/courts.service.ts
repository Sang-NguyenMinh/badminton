import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Court } from './schemas/court.schema';
import { Model, Types } from 'mongoose';
import aqp from 'api-query-params';
import { CreateCourtDto, UpdateCourtDto } from './dto/courts.dto';
import { ReservationDetail } from '../reservation-details/schemas/reservation-details.schema';
import { Facility } from '../facilities/schemas/facility.schema';
import moment from 'moment';

@Injectable()
export class CourtsService {
  constructor(
    @InjectModel(Court.name) private readonly courtModel: Model<Court>,
    @InjectModel(ReservationDetail.name)
    private readonly reservationDetailModel: Model<ReservationDetail>,
    @InjectModel(Facility.name) private readonly facilityModel: Model<Facility>,
  ) {}

  async create(createCourtDto: CreateCourtDto): Promise<Court> {
    const newCourt = new this.courtModel(createCourtDto);
    return newCourt.save();
  }

  async findAll(
    query: string = '',
    current: number = 1,
    pageSize: number = 10,
  ) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    const totalItems = await this.courtModel.countDocuments(filter).exec();
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;

    const hasPrevious = current > 1;
    const hasNext = current < totalPages;

    const results = await this.courtModel
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

  async findOne(id: string): Promise<Court> {
    const court = await this.courtModel.findById(id).exec();
    if (!court) {
      throw new NotFoundException(`Court with ID ${id} not found`);
    }
    return court;
  }

  async update(id: string, updateCourtDto: UpdateCourtDto): Promise<Court> {
    const updatedCourt = await this.courtModel
      .findByIdAndUpdate(id, updateCourtDto, { new: true })
      .exec();

    if (!updatedCourt) {
      throw new NotFoundException(`Court with ID ${id} not found`);
    }

    return updatedCourt;
  }

  async remove(id: string): Promise<void> {
    const result = await this.courtModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Court with ID ${id} not found`);
    }
  }

  //using
  async getCourtsByFacilityId(facilityId: string): Promise<Court[]> {
    return this.courtModel.find({ facilityId }).exec();
  }

  async checkCourtAvailability(
    facilityId: string,
    date: string,
    startTime: string | null,
    endTime: string | null,
  ) {
    const courts = await this.courtModel.find({ facilityId });
    const reservationDate = moment
      .utc(date, 'DD/MM/YYYY')
      .startOf('day')
      .toDate();
    const nextDay = moment.utc(reservationDate).add(1, 'days').toDate();

    const courtsAvailability = await Promise.all(
      courts.map(async (court) => {
        let query: any = {
          courtId: court._id,
          reservationID: { $exists: true },
          reservationDate: {
            $gte: reservationDate,
            $lt: nextDay,
          },
        };

        if (startTime !== null && endTime !== null) {
          query.$or = [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
            { startTime: { $gte: startTime, $lt: endTime } },
            { endTime: { $gt: startTime, $lte: endTime } },
          ];
        }

        const reservations = await this.reservationDetailModel.find(query);

        const isAvailable = reservations.length === 0;
        return {
          courtId: court._id.toString(),
          isAvailable,
          name: court.name,
          pricePerHour: court.pricePerHour,
          message: isAvailable
            ? 'Court is available'
            : 'Court is not available',
        };
      }),
    );
    return { courts: courtsAvailability };
  }
}
