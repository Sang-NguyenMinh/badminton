import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './core/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FacilitiesModule } from './core/facilities/facilities.module';
import { CourtsModule } from './core/courts/courts.module';
import { ItemsModule } from './core/items/items.module';
import { ReservationsModule } from './core/reservations/reservations.module';
import { InvoicesModule } from './core/invoices/invoices.module';
import { ReservationDetailsModule } from './core/reservation-details/reservation-details.module';
import { InvoiceDetailsModule } from './core/invoice-details/invoice-details.module';
import { GroupsModule } from './core/groups/groups.module';
import { GroupMembersModule } from './core/group-members/group-members.module';
import { PostsModule } from './core/posts/posts.module';
import { CommentsModule } from './core/comments/comments.module';
import { ReactionsModule } from './core/reactions/reactions.module';
import { FriendshipsModule } from './core/friendships/friendships.module';
import { AuthsModule } from './auths/auths.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auths/passport/jwt-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { GoogleStrategy } from './auths/passport/google.strategy';
import { MessagesModule } from './core/messages/messages.module';
import { ConversationsModule } from './core/conversations/conversations.module';
import { PaymentModule } from './core/payment/payment.module';
import { PaymentService } from './core/payment/payment.service';
import { PaymentController } from './core/payment/payment.controller';
import { ChatGateway } from 'src/chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { NotificationModule } from './notification/notification.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    UsersModule,
    FacilitiesModule,
    CourtsModule,
    ItemsModule,
    ReservationsModule,
    ReservationDetailsModule,
    InvoicesModule,
    InvoiceDetailsModule,
    GroupsModule,
    GroupMembersModule,
    PostsModule,
    CommentsModule,
    ReactionsModule,
    FriendshipsModule,
    ReservationsModule,
    InvoicesModule,
    ReservationDetailsModule,
    InvoiceDetailsModule,
    GroupsModule,
    GroupMembersModule,
    PostsModule,
    CommentsModule,
    ReactionsModule,
    FriendshipsModule,
    AuthsModule,
    MessagesModule,
    ConversationsModule,
    PaymentModule,
    ChatModule,
    CloudinaryModule,
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: 'badminton-admin',
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        template: {
          dir: process.cwd() + '/src/mail/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    ChatModule,
    NotificationModule,
    CloudinaryModule,
  ],
  controllers: [AppController, PaymentController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    GoogleStrategy,
    PaymentService,
  ],
})
export class AppModule {}
