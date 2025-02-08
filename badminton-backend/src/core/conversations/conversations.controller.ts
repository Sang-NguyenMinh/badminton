import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser, Roles } from 'src/decorators/customize';
import { ConversationsService } from './conversations.service';
import { Message } from '../messages/schemas/messages.scheme';
import { MessagesService } from '../messages/messages.service';
import { CreateMessageDto } from '../messages/dto/messages.dto';

@Controller('conversations')
export class ConversationsController {
  constructor(
    private conversationsService: ConversationsService,
    private messagesService: MessagesService,
  ) {}

  @Roles('Admin', 'Owner', 'User')
  @Get()
  async getConversations(@CurrentUser() user: any) {
    return this.conversationsService.getConversationByUserId(user._id);
  }

  @Roles('Admin', 'Owner', 'User')
  @Get(':conversationId/messages')
  async getMessages(
    @Param('conversationId') conversationId: string,
  ): Promise<Message[]> {
    const messages = await this.messagesService.getMessages(conversationId);
    return messages;
  }

  @Roles('Admin', 'Owner', 'User')
  @Post('/messages')
  async addMessageToConversation(
    @Body() createMessageDto: CreateMessageDto,
    @CurrentUser() user: any,
  ): Promise<any> {
    const data = await this.messagesService.addMessage(createMessageDto);

    return data;
  }
}
