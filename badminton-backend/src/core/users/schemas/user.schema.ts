import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ACCOUNT_TYPE, ROLES } from 'src/config/type';
import { Document, Schema as MongooseSchema, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  displayName?: string;

  @Prop()
  username?: string;

  @Prop()
  password: string;

  @Prop({ unique: true })
  email?: string;

  @Prop()
  phone?: string;

  @Prop()
  address?: string;

  @Prop()
  avatar?: string;

  @Prop()
  backgroundImage?: string;

  @Prop({ default: ROLES.USER })
  role?: ROLES;

  @Prop({ default: Date.now })
  lastSeen: Date;

  @Prop({ default: false })
  isOnline: boolean;

  @Prop({ default: ACCOUNT_TYPE.LOCAL })
  accountType?: ACCOUNT_TYPE;

  @Prop({ default: false })
  isActive?: boolean;

  @Prop()
  pushToken?: string;

  @Prop()
  codeId?: string;

  @Prop()
  codeExpired?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
