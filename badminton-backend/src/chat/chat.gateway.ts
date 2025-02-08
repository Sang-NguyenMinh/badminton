import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConversationsService } from 'src/core/conversations/conversations.service';
import { MessagesService } from 'src/core/messages/messages.service';
import { UsersService } from 'src/core/users/users.service';
import { NotificationService } from 'src/notification/notification.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/socket',
})
export class ChatGateway {
  @WebSocketServer() server: Server;
  private activeSockets: { [key: string]: string } = {};

  constructor(
    private conversationService: ConversationsService,
    private notificationService: NotificationService,
    private messageService: MessagesService,
    private userService: UsersService,
  ) {}

  @SubscribeMessage('join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; conversationId: string },
  ) {
    const { userId, conversationId } = data;
    console.log(
      `User ${userId} with socket ID ${client.id} joined conversation ${conversationId}`,
    );
    this.activeSockets[userId] = client.id;
    await this.userService.updateUserStatus(userId, true);
    client.join(conversationId);

    this.server.emit('userOnline', userId);
  }

  @SubscribeMessage('leave')
  async handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; conversationId: string },
  ) {
    const { userId, conversationId } = data;
    console.log(
      `User ${userId} with socket ID ${client.id} left conversation ${conversationId}`,
    );

    await this.userService.updateUserStatus(userId, false);
    client.leave(conversationId);

    delete this.activeSockets[userId];
    this.server.emit('userOffline', userId);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: {
      senderId: string;
      conversationId: string;
      content: string;
      messageType: string;
      _id: string;
    },
  ) {
    const { _id, senderId, conversationId } = data;

    const message = await this.messageService.getMessageById(_id);
    const conversation =
      await this.conversationService.getConversationById(conversationId);

    console.log('Active sockets:', this.activeSockets);
    console.log(conversation.participants);

    const notificationPromises = conversation.participants.map(
      async (participantId: any) => {
        if (senderId === participantId._id.toString()) return;

        const socketId = this.activeSockets[participantId?._id.toString()];
        if (socketId) {
          console.log(
            `Emitting newMessage to socket ID ${socketId} for user ${participantId}`,
          );
          this.server
            .to(socketId)
            .emit('newMessage', { message, conversationId });
        } else {
          console.warn(`No active socket found for user ID: ${participantId}`);
        }
        try {
          const user = await this.userService.findOne(participantId._id);
          if (user && user.pushToken) {
            await this.notificationService.sendBatchPushNotifications([
              {
                pushToken: user.pushToken,
                message: `Bạn có tin nhắn mới `,
                data: {
                  messageId: message._id,
                  conversationId: conversationId,
                  senderId: senderId,
                },
              },
            ]);
            console.log(
              `Push notification sent successfully to user ${user._id}`,
            );
          } else {
            console.warn(`No push token found for user ${user?._id}`);
          }
        } catch (error) {
          console.error(
            `Failed to send push notification to user ${participantId._id}`,
            error,
          );
        }
      },
    );

    await Promise.all(notificationPromises);

    await this.conversationService.updateLastMessage(
      conversationId,
      message._id,
    );
  }

  @SubscribeMessage('createConversation')
  async handleCreateConversation(
    @MessageBody()
    data: {
      participants: string[];
      isGroup: boolean;
      groupName?: string;
    },
  ) {
    const conversation =
      await this.conversationService.createConversation(data);
    conversation.participants.forEach((participantId) => {
      const socketId = this.activeSockets[participantId.toString()];
      if (socketId) {
        this.server.to(socketId).emit('newConversation', conversation);
      }
    });
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { userId: string; conversationId: string },
  ) {
    this.server.to(data.conversationId).emit('userTyping', data.userId);
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(
    @MessageBody() data: { userId: string; conversationId: string },
  ) {
    this.server.to(data.conversationId).emit('userStopTyping', data.userId);
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(@ConnectedSocket() client: Socket) {
    const userId = Object.keys(this.activeSockets).find(
      (id) => this.activeSockets[id] === client.id,
    );
    if (userId) {
      delete this.activeSockets[userId];
      console.log(
        `User ${userId} disconnected and removed from activeSockets.`,
      );
    }
  }
}
