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
import { FacilitiesService } from './facilities.service';
import { Public } from 'src/decorators/customize';
import { CreateFacilityDto, UpdateFacilityDto } from './dto/facilities.dto';
import { CourtsService } from '../courts/courts.service';
import { Facility } from './schemas/facility.schema';

@Controller('facilities')
export class FacilitiesController {
  constructor(
    private facilitiesService: FacilitiesService,
    private courtService: CourtsService,

  ) {}

  @Public()
  @Post()
  async create(@Body() createFacilityDto: CreateFacilityDto) {
    return this.facilitiesService.create(createFacilityDto);
  }

  @Public()
  @Get('by-phone')
  async getFacilityByPhone(@Query('phone') phone: string|number): Promise<any> {
    return this.facilitiesService.getFacilityByPhone(phone.toString());
  }

  @Public()
  @Get()
  async findAll(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query('keyword') keyword: string,
  ) {
    return this.facilitiesService.findAll(query, +current, +pageSize, keyword);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.facilitiesService.findOne(id);
  }

  @Public()
  @Patch()
  async update(@Body() updateFacilityDto: UpdateFacilityDto) {
    return this.facilitiesService.update(updateFacilityDto);
  }

  @Public()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.facilitiesService.remove(id);
  }


  //using

 

  @Public()
  @Get(':id/working-hours')
  async getWorkingHours(@Param('id') id: string) {
    return this.facilitiesService.getWorkingHours(id);
  }

  @Public()
  @Get(':facilityId/courts')
  async getCourts(@Param('facilityId') facilityId: string) {
    const courts = await this.courtService.getCourtsByFacilityId(facilityId);
    return { courts };
  }

}
