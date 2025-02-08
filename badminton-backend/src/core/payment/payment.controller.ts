import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Public } from 'src/decorators/customize';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Public()
  @Post('create-momo-payment')
  async createMomoPayment(
    @Body() paymentData: { orderId: string; amount: number; orderInfo: string },
  ) {
    try {
      const result = await this.paymentService.createPayment(
        paymentData.orderId,
        paymentData.amount,
        paymentData.orderInfo,
      );
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Public()
  @Post('verify-momo-payment')
  async verifyMomoPayment(
    @Body()
    paymentResult: {
      orderId: string;
      resultCode: string;
      message: string;
    },
  ) {
    try {
      const isValid = await this.paymentService.verifyPayment(paymentResult);

      if (isValid) {
        return { success: true, message: 'Payment verified successfully' };
      } else {
        return { success: false, message: 'Payment verification failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
