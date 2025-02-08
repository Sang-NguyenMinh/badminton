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
import { ReservationDetailsService } from './reservation-details.service';
import {
  CreateReservationDetailDto,
  UpdateReservationDetailDto,
} from './dto/reservation-detail.dto';

@Controller('reservation-details')
export class ReservationDetailsController {
  constructor(
    private readonly reservationDetailsService: ReservationDetailsService,
  ) {}

  @Get()
  async findAll(
    @Query('query') query: string = '',
    @Query('current') current: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.reservationDetailsService.findAll(query, current, pageSize);
  }

  @Post()
  async create(@Body() createReservationDetailDto: CreateReservationDetailDto) {
    return this.reservationDetailsService.create(createReservationDetailDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reservationDetailsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReservationDetailDto: UpdateReservationDetailDto,
  ) {
    return this.reservationDetailsService.update(
      id,
      updateReservationDetailDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.reservationDetailsService.remove(id);
  }
}
