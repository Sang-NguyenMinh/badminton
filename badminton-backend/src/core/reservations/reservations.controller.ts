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
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationDetail } from '../reservation-details/schemas/reservation-details.schema';
import { ReservationDetailsService } from '../reservation-details/reservation-details.service';
import { Types } from 'mongoose';
import { CurrentUser, Public } from 'src/decorators/customize';
import moment from 'moment';

@Controller('reservations')
export class ReservationsController {
  constructor(
    
    private readonly reservationsService: ReservationsService,
    private readonly reservationDetailsService: ReservationDetailsService,
  ) {}

  @Get()
  async findAll(
    @CurrentUser() user: any,

    @Query('query') query: string = '',
    @Query('current') current: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('keyword') keyword: string = '',
    @Query('status') status: string = '',
    
  ) {

    
    return this.reservationsService.findAll(query, current, pageSize,keyword,user._id,status);
  }

  @Public()
  @Post()
  async create(@Body() createReservationDto: CreateReservationDto) {
    console.log(createReservationDto.reservationDate)

    const res = await this.reservationsService.create(createReservationDto);
    const reservationId = res._id;

    // Create reservation details for each court
    const reservationDetailsPromises = createReservationDto.courts.map(async (court) => {

        const courtId = new Types.ObjectId(court.id); 
       
        await this.reservationDetailsService.create({
            reservationID: reservationId, 
            courtId: courtId,
            price: court.price,
            startTime: court.startTime,
            endTime: court.endTime,
            reservationDate:moment.utc(createReservationDto.reservationDate, 'MM/DD/YYYY').toDate()
        });
    });

    await Promise.all(reservationDetailsPromises);

    return res; 
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}
