import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto/posts.dto';
import { CurrentUser, Public } from 'src/decorators/customize';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/shared/cloudinary.service';
import { POST_STATUS } from 'src/config/type';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Public()
  @Get()
  async findAll(
    @Query('query') query: string = '',
    @Query('current') current: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.postsService.findAll(query, current, pageSize);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @CurrentUser() user: any,
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const uploadedImages = await Promise.all(
      files.map((file) => this.cloudinaryService.uploadImage(file)),
    );

    const imageUrls = uploadedImages.map((image) => image.secure_url);

    createPostDto.owner = user._id;
    return this.postsService.create({
      ...createPostDto,
      images: imageUrls,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
