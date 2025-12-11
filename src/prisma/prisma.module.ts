import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // PrismaService будет доступен в приложении без явного импорта модуля в каждом модуле
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
