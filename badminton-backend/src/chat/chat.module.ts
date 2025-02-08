import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ConversationsModule } from 'src/core/conversations/conversations.module';
import { UsersModule } from 'src/core/users/users.module';
import { MessagesModule } from 'src/core/messages/messages.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    ConversationsModule,
    UsersModule,
    MessagesModule,
    NotificationModule,
  ],
  providers: [ChatGateway],
})
export class ChatModule {}
