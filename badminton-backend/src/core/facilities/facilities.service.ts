import { Injectable, NotFoundException } from '@nestjs/common';
import { Facility } from './schemas/facility.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { CreateFacilityDto, UpdateFacilityDto } from './dto/facilities.dto';
import moment from 'moment';

@Injectable()
export class FacilitiesService {
  constructor(
    @InjectModel(Facility.name) private facilityModel: Model<Facility>,
  ) {}

  async create(createFacilityDto: CreateFacilityDto): Promise<Facility> {
    const newFacility = new this.facilityModel(createFacilityDto);
    return newFacility.save();
  }

  async findAll(
    query: string,
    current: number,
    pageSize: number,
    keyword: string,
  ) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { address: { $regex: keyword, $options: 'i' } },
      ];
    }

    const totalItems = (await this.facilityModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * pageSize;

    const hasPrevious = current > 1;
    const hasNext = current < totalPages;

    const results = await this.facilityModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any);

    return {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,
        previous: hasPrevious,
        next: hasNext,
      },
      results,
    };
  }

  async findOne(id: string): Promise<Facility> {
    const facility = await this.facilityModel.findById(id).exec();
    if (!facility) {
      throw new NotFoundException(`Facility with ID ${id} not found`);
    }
    return facility;
  }

  async update(updateFacilityDto: UpdateFacilityDto) {
    const updatedFacility = await this.facilityModel
      .findByIdAndUpdate(updateFacilityDto._id, updateFacilityDto)
      .exec();

    if (!updatedFacility) {
      throw new NotFoundException(
        `Facility with ID ${updateFacilityDto._id} not found`,
      );
    }

    return 'Thành công';
  }

  async remove(id: string): Promise<void> {
    const result = await this.facilityModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Facility with ID ${id} not found`);
    }
  }

  //using

  async getFacilityByPhone(phone: string): Promise<Facility> {
    return this.facilityModel.findOne({ hotline: phone }).exec();
  }

  async getWorkingHours(facilityId: string) {
    const facility = await this.findOne(facilityId);
    const { startTime, endTime } = facility;

    const start = moment(startTime, 'HH:mm');
    const end = moment(endTime, 'HH:mm');
    const times = [];

    while (start <= end) {
      times.push(start.format('HH:mm'));
      start.add(30, 'minutes');
    }

    return { times };
  }
}
