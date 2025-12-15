import { Module } from '@nestjs/common';
import { PostsLoader } from './posts.loader';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';

@Module({
  providers: [PostsResolver, PostsService, PostsLoader],
})
export class PostsModule {}
