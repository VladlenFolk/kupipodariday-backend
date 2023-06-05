import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
bootstrap();
