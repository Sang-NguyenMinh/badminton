import { Injectable } from '@nestjs/common';
import {
  Expo,
  ExpoPushMessage,
  ExpoPushTicket,
  ExpoPushReceipt,
} from 'expo-server-sdk';

export interface NotificationPayload {
  pushToken: string;
  message: string;
  data?: Record<string, unknown>;
}

@Injectable()
export class NotificationService {
  private expo: Expo;

  constructor() {
    this.expo = new Expo();
  }

  async sendBatchPushNotifications(
    notifications: NotificationPayload[],
  ): Promise<ExpoPushTicket[]> {
    const messages: ExpoPushMessage[] = notifications
      .filter(({ pushToken }) => Expo.isExpoPushToken(pushToken))
      .map(({ pushToken, message, data }) => ({
        to: pushToken,
        sound: 'default',
        body: message,
        data: data || {},
      }));

    const chunks = this.expo.chunkPushNotifications(messages);
    const tickets: ExpoPushTicket[] = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Error sending push notifications:', error);
      }
    }

    return tickets;
  }

  async checkPushNotificationStatus(tickets: ExpoPushTicket[]): Promise<void> {
    const receiptIds = tickets
      .filter(
        (ticket): ticket is ExpoPushTicket & { id: string } => 'id' in ticket,
      )
      .map((ticket) => ticket.id);

    const receiptIdChunks =
      this.expo.chunkPushNotificationReceiptIds(receiptIds);

    for (const chunk of receiptIdChunks) {
      try {
        const receipts =
          await this.expo.getPushNotificationReceiptsAsync(chunk);

        for (const receiptId in receipts) {
          const receipt = receipts[receiptId];
          if (receipt.status === 'ok') {
            continue;
          } else if (receipt.status === 'error') {
            console.error(
              `There was an error sending a notification: ${receipt.message}`,
            );
            if (receipt.details && 'error' in receipt.details) {
              console.error(`The error code is ${receipt.details.error}`);
            }
          }
        }
      } catch (error) {
        console.error('Error checking push notification status:', error);
      }
    }
  }
}
