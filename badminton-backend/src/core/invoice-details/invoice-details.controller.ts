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
import { InvoiceDetailsService } from './invoice-details.service';
import {
  CreateInvoiceDetailDto,
  UpdateInvoiceDetailDto,
} from './dto/invoice-detail.dto';

@Controller('invoice-details')
export class InvoiceDetailsController {
  constructor(private readonly invoiceDetailsService: InvoiceDetailsService) {}

  @Get()
  async findAll(
    @Query('query') query: string = '',
    @Query('current') current: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.invoiceDetailsService.findAll(query, current, pageSize);
  }

  @Post()
  async create(@Body() createInvoiceDetailDto: CreateInvoiceDetailDto) {
    return this.invoiceDetailsService.create(createInvoiceDetailDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.invoiceDetailsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInvoiceDetailDto: UpdateInvoiceDetailDto,
  ) {
    return this.invoiceDetailsService.update(id, updateInvoiceDetailDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.invoiceDetailsService.remove(id);
  }
}
