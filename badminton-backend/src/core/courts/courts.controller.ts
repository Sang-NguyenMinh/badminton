import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  BadRequestException,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { CourtsService } from './courts.service';
import aqp from 'api-query-params';
import { InjectModel } from '@nestjs/mongoose';
import { Court } from './schemas/court.schema';
import { Model } from 'mongoose';
import { Public } from 'src/decorators/customize';
import {
  CourtAvailabilityDto,
  CreateCourtDto,
  UpdateCourtDto,
} from './dto/courts.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('courts')
export class CourtsController {
  constructor(private readonly courtsService: CourtsService) { }

  // @Get()
  // async findAll(
  //   @Query('query') query: string = '',
  //   @Query('current') current: number = 1,
  //   @Query('pageSize') pageSize: number = 10
  // ) {
  //   return this.courtsService.findAll(query, current, pageSize);
  // }

  // @Public()
  // @Post()
  // async create(@Body() createCourtDto: CreateCourtDto) {
  //   return this.courtsService.create(createCourtDto);
  // }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.courtsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourtDto: UpdateCourtDto,
  ) {
    return this.courtsService.update(id, updateCourtDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.courtsService.remove(id);
  }

  @Public()
  @Get()
  async getCourtAvailability(
    @Query('facilityId') facilityId: string,
    @Query('date') date: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
  ) {
    return this.courtsService.checkCourtAvailability(
      facilityId,
      date,
      startTime,
      endTime,
    );
  }
}
