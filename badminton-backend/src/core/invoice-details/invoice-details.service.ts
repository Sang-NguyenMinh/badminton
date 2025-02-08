import { Injectable, NotFoundException } from '@nestjs/common';
import aqp from 'api-query-params';
import { InvoiceDetail } from './schemas/invoice-detail.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateInvoiceDetailDto,
  UpdateInvoiceDetailDto,
} from './dto/invoice-detail.dto';

@Injectable()
export class InvoiceDetailsService {
  constructor(
    @InjectModel(InvoiceDetail.name)
    private readonly invoiceDetailModel: Model<InvoiceDetail>,
  ) {}

  async create(
    createInvoiceDetailDto: CreateInvoiceDetailDto,
  ): Promise<InvoiceDetail> {
    const newInvoiceDetail = new this.invoiceDetailModel(
      createInvoiceDetailDto,
    );
    return newInvoiceDetail.save();
  }

  async findAll(
    query: string = '',
    current: number = 1,
    pageSize: number = 10,
  ) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    const totalItems = await this.invoiceDetailModel
      .countDocuments(filter)
      .exec();
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;

    const hasPrevious = current > 1;
    const hasNext = current < totalPages;

    const results = await this.invoiceDetailModel
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

  async findOne(id: string): Promise<InvoiceDetail> {
    const invoiceDetail = await this.invoiceDetailModel.findById(id).exec();
    if (!invoiceDetail) {
      throw new NotFoundException(`InvoiceDetail with ID ${id} not found`);
    }
    return invoiceDetail;
  }

  async update(
    id: string,
    updateInvoiceDetailDto: UpdateInvoiceDetailDto,
  ): Promise<InvoiceDetail> {
    const updatedInvoiceDetail = await this.invoiceDetailModel
      .findByIdAndUpdate(id, updateInvoiceDetailDto, { new: true })
      .exec();

    if (!updatedInvoiceDetail) {
      throw new NotFoundException(`InvoiceDetail with ID ${id} not found`);
    }

    return updatedInvoiceDetail;
  }

  async remove(id: string): Promise<void> {
    const result = await this.invoiceDetailModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`InvoiceDetail with ID ${id} not found`);
    }
  }
}
