import {
  Body, Controller, Get, Post, Param,
  ParseIntPipe, UseGuards, Request,
} from '@nestjs/common'
import { ReviewsService } from './reviews.service'
import { AuthGuard } from '@nestjs/passport'
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

class CreateReviewDto {
  @IsInt() @Min(1) @Max(5) rating: number
  @IsOptional() @IsString() comment?: string
}

@Controller('plumbers/:plumberId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // GET /plumbers/:id/reviews — public
  @Get()
  async findAll(@Param('plumberId', ParseIntPipe) plumberId: number) {
    return this.reviewsService.findAll(plumberId)
  }

  // POST /plumbers/:id/reviews — authentifié
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Param('plumberId', ParseIntPipe) plumberId: number,
    @Body() dto: CreateReviewDto,
    @Request() req: any,
  ) {
    return this.reviewsService.create(plumberId, req.user.sub, dto.rating, dto.comment)
  }
}