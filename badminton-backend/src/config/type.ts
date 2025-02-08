import { ObjectId } from 'mongoose';

export interface GoogleUser {
  _id: ObjectId;
  email?: string;
  role?: string;
}

export enum ROLES {
  ADMIN = 'Admin',
  OWNER = ' Owner',
  USER = 'User',
}

export enum ACCOUNT_TYPE {
  LOCAL = 'Local',
  GOOGLE = 'Google',
}

export enum PAYMENT_METHOD {
  CASH = 'Cash',
  MOMO = 'MoMo',
  ZALLOPAY = 'ZaloPay',
}

export enum PAYMENT_STATUS {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  REFUNDED = 'Refunded',
}

export enum POST_STATUS {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived',
  DELETED = 'Deleted',
}

export enum ITEM_STATUS {
  AVAILABLE = 'Available',
  OUT_OF_STOCK = 'Out of Stock',
  DISCONTINUED = 'Discontinued',
}

export enum GROUP_STATUS {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  PENDING = 'Pending',
  ARCHIVED = 'Archived',
}

export enum GROUP_ROLE {
  ADMIN = 'Admin',
  MEMBER = 'Member',
}

export enum FRIENDSHIP_STATUS {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  DECLINED = 'Declined',
  BLOCKED = 'Blocked',
}

export enum WEEKDAY {
  MONDAY = 'Thứ hai',
  TUESDAY = 'Thứ ba',
  WEDNESDAY = 'Thứ tư',
  THURSDAY = 'Thứ năm',
  FRIDAY = 'Thứ sáu',
  SATURDAY = 'Thứ bảy',
  SUNDAY = 'Chủ nhật',
}


