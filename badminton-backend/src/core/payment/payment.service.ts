import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  private readonly endpoint =
    'https://test-payment.momo.vn/v2/gateway/api/create';
  private readonly queryEndpoint =
    'https://test-payment.momo.vn/v2/gateway/api/query';
  private readonly partnerCode = 'MOMO';
  private readonly accessKey = 'F8BBA842ECF85';
  private readonly secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  private readonly redirectUrl = 'badminton-backend://map';
  private readonly ipnUrl =
    'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';

  async createPayment(
    orderId: string,
    amount: number,
    orderInfo: string,
  ): Promise<any> {
    const requestId = orderId;
    const requestType = 'captureWallet';
    const extraData = '';
    const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${this.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${this.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode: this.partnerCode,
      accessKey: this.accessKey,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: this.redirectUrl,
      ipnUrl: this.ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: 'vi',
    };

    try {
      const response = await axios.post(this.endpoint, requestBody);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create MoMo payment');
    }
  }

  async verifyPayment(paymentResult: {
    orderId: string;
    resultCode: string;
    message: string;
  }): Promise<boolean> {
    const { orderId } = paymentResult;
    const requestId = orderId;
    const rawSignature = `accessKey=${this.accessKey}&orderId=${orderId}&partnerCode=${this.partnerCode}&requestId=${requestId}`;

    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode: this.partnerCode,
      requestId: requestId,
      orderId: orderId,
      lang: 'vi',
      signature: signature,
    };

    try {
      const response = await axios.post(this.queryEndpoint, requestBody);
      const { resultCode } = response.data;

      console.log(response.data);
      if (resultCode == 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Lỗi khi xác minh thanh toán MoMo:', error);
      return false;
    }
  }
}
