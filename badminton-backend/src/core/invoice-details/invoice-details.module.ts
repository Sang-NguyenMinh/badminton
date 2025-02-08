import { Module } from '@nestjs/common';
import { InvoiceDetailsService } from './invoice-details.service';
import { InvoiceDetailsController } from './invoice-details.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InvoiceDetail,
  InvoiceDetailSchema,
} from './schemas/invoice-detail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InvoiceDetail.name, schema: InvoiceDetailSchema },
    ]),
  ],
  controllers: [InvoiceDetailsController],
  providers: [InvoiceDetailsService],
})
export class InvoiceDetailsModule {}
