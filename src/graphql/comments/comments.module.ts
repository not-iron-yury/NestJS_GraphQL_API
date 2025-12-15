import { Module } from '@nestjs/common';
import { CommentsLoader } from './comments.loader';
import { CommentsResolver } from './comments.resolver';
import { CommentsService } from './comments.service';

@Module({
  providers: [CommentsResolver, CommentsService, CommentsLoader],
})
export class CommentsModule {}
