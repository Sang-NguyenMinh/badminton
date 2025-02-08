import { Controller, Post, Body } from '@nestjs/common';
import {
  NotificationPayload,
  NotificationService,
} from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly pushNotificationService: NotificationService) {}

  @Post('send-batch')
  async sendBatchNotifications(
    @Body() body: { notifications: NotificationPayload[] },
  ) {
    const tickets =
      await this.pushNotificationService.sendBatchPushNotifications(
        body.notifications,
      );

    setTimeout(() => {
      this.pushNotificationService.checkPushNotificationStatus(tickets);
    }, 5000);

    return { message: 'Batch notifications sent', ticketCount: tickets.length };
  }
}
