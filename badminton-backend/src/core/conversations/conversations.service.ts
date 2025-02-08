import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation } from './schemas/conversation.schema';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}

  async createConversation(data: {
    participants: string[];
    isGroup: boolean;
    groupName?: string;
  }): Promise<Conversation> {
    const newConversation = new this.conversationModel(data);
    return newConversation.save();
  }

  async getConversationById(user: any): Promise<Conversation> {
    const b = this.conversationModel
      .findById(user)
      .populate('participants')
      .exec();
    return b;
  }

  async updateLastMessage(
    conversationId: string,
    messageId: string,
  ): Promise<void> {
    await this.conversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: messageId,
    });
  }

  async getConversationByUserId(id: string): Promise<any[]> {
    const objectId = new Types.ObjectId(id);

    const conversations = await this.conversationModel
      .find({
        participants: objectId,
      })
      .populate({
        path: 'participants',
        select: 'avatar displayName isOnline',
      })
      .populate({
        path: 'lastMessage',
        select: 'content messageType',
      })
      .lean()
      .exec();

    return conversations.map((conv) => ({
      conversationId: conv._id.toString(),
      isGroup: conv.isGroup,
      name: conv.groupName || null,
      lastMessage: conv.lastMessage
        ? {
            content: conv.lastMessage['content'],
            messageType: conv.lastMessage['messageType'],
          }
        : null,
      participants: conv.participants.map((participant) => ({
        avatar: participant['avatar'],
        displayName: participant['displayName'],
        isOnline: participant['isOnline'],
      })),
    }));
  }
}
