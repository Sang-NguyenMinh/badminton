import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/messages.scheme';
import { Conversation } from '../conversations/schemas/conversation.schema';
import { CreateMessageDto } from './dto/messages.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,

    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}

  async createMessage(
    senderId: string,
    conversationId: string,
    content: string,
    messageType: string,
  ): Promise<Message> {
    const newMessage = new this.messageModel({
      sender: senderId,
      conversation: conversationId,
      content,
      messageType,
    });
    return newMessage.save();
  }

  async getMessageById(messageId: string): Promise<any> {
    const message = await this.messageModel
      .findById(messageId)
      .select('_id sender conversation content messageType createdAt')
      .exec();

    if (!message) {
      return null;
    }

    return message;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    const messages = await this.messageModel
      .find({ conversation: conversationId })
      .populate({
        path: 'sender',
        select: '_id displayName avatar',
      })
      .sort({ createdAt: -1 })
      .exec();
    return messages;
  }

  async addMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    try {
      const { senderId, conversationId, content, messageType, fileUrl } =
        createMessageDto;

      const newMessage = await new this.messageModel({
        sender: senderId,
        conversation: conversationId,
        content,
        messageType,
        fileUrl,
        read: false,
        readBy: [senderId],
      });

      const savedMessage = await newMessage.save();

      console.log(savedMessage);

      const a = await this.conversationModel.findByIdAndUpdate(conversationId, {
        lastMessage: savedMessage._id,
        $set: { updatedAt: new Date() },
      });

      await savedMessage.populate('sender', '_id displayName avatar');

      return savedMessage;
    } catch (error) {
      console.log(error);
    }
  }
}
