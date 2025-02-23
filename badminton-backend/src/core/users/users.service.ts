import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { BcryptService } from 'src/shared/bcrypt.service';
import aqp from 'api-query-params';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import {
  ChangePasswordAuthDto,
  CodeAuthDto,
} from 'src/auths/dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { isPropertyExist } from 'src/config/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,

    private readonly bcryptService: BcryptService,
    private readonly mailerService: MailerService,
  ) {}

  async updateUserStatus(userId: string, isOnline: boolean): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      isOnline,
      lastSeen: new Date(),
    });
  }

  async create(createUserDto: CreateUserDto) {
    const { displayName, username, role, email, isActive } = createUserDto;

    let password = null;
    if (createUserDto.password)
      password = await this.bcryptService.hashPassword(createUserDto.password);

    const user = new this.userModel({
      displayName,
      username,
      password,
      role,
      email,
      isActive,
    });

    user.save();

    return {
      _id: user._id,
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * pageSize;

    const hasPrevious = current > 1;
    const hasNext = current < totalPages;

    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select('-password')
      .sort(sort as any);

    return {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,
        previous: hasPrevious,
        next: hasNext,
      },
      results,
    };
  }

  async findOne(id: string) {
    const user = await this.userModel
      .findById(id)
      .select(
        'displayName username email phone address avatar backgroundImage role accountType isActive pushToken',
      )
      .exec();
    return user;
  }

  async findByUsernameOrEmail(keyword: string) {
    return await this.userModel.findOne({
      $or: [{ email: keyword }, { username: keyword }],
    });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }

  async remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return await this.userModel.deleteOne({ _id });
    } else {
      throw new BadRequestException('Id không đúng định dạng mongodb');
    }
  }

  async handleRegister(createUserDto: CreateUserDto) {
    const { username, password, email } = createUserDto;

    const isExistEmail = await isPropertyExist(this.userModel, 'email', email);
    if (isExistEmail === true) {
      throw new BadRequestException(
        `Email ${email} already exists, please use another email.`,
      );
    }

    const isExistUsername = await isPropertyExist(
      this.userModel,
      'username',
      username,
    );
    if (isExistUsername === true) {
      throw new BadRequestException(
        `Username ${username} already exists, please use another username.`,
      );
    }

    const hashPassword = await this.bcryptService.hashPassword(password);
    const codeId = uuidv4();

    try {
      const user = await this.userModel.create({
        username,
        email,
        password: hashPassword,
        codeId: codeId,
        codeExpired: dayjs().add(5, 'minutes'),
      });

      try {
        await this.mailerService.sendMail({
          to: user.email,
          subject: 'Activate your account at Sport book',
          template: 'register',
          context: {
            name: user.displayName ?? user.email,
            activationCode: codeId,
          },
        });
      } catch (emailError) {
        console.error('Error sending activation email:', emailError);
        throw new InternalServerErrorException(
          'An error occurred while sending activation email.',
        );
      }

      return {
        success: true,
        message: 'User registered successfully',
        userId: user._id,
        email: email,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException(
        'An error occurred while creating the user.',
      );
    }
  }

  async handleActive(data: CodeAuthDto) {
    const user = await this.userModel.findOne({
      _id: data._id,
    });
    if (!user) {
      throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn');
    }

    const isBeforeCheck = dayjs().isBefore(user.codeExpired);

    if (isBeforeCheck) {
      await this.userModel.updateOne(
        { _id: data._id },
        {
          isActive: true,
        },
      );
      return { isBeforeCheck };
    } else {
      throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn');
    }
  }

  async retryActive(email: string) {
    const user = await this.userModel.findOne({ email });
    console.log(user);

    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }
    if (user.isActive) {
      throw new BadRequestException('Tài khoản đã được kích hoạt');
    }

    const codeId = uuidv4();

    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes'),
    });

    this.mailerService.sendMail({
      to: user.email,
      subject: 'Activate your account at Sport book app',
      template: 'register',
      context: {
        name: user?.displayName ?? user.email,
        activationCode: codeId,
      },
    });
    return {
      _id: user._id,
      status: 'success',
    };
  }

  async retryPassword(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }

    const codeId = uuidv4();

    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes'),
    });

    this.mailerService.sendMail({
      to: user.email,
      subject: 'Change your password account at Sport book app',
      template: 'register',
      context: {
        name: user?.displayName ?? user.email,
        resetPasswordLink: 'facebook.com',
      },
    });
    return { _id: user._id, email: user.email };
  }

  async changePassword(data: ChangePasswordAuthDto) {
    const user = await this.userModel.findOne({ email: data.email });

    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }

    try {
      const newPassword = await this.bcryptService.hashPassword(data.password);
      await user.updateOne({ password: newPassword });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something wrong when update password',
      );
    }
  }
}
