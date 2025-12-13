import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // если лишние данные в запросе - просто удаляем их
      //  forbidNonWhitelisted: true, // если лишние данные в запросе - выбрасываем ошибку
      transform: true, // преобразуем типы
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
