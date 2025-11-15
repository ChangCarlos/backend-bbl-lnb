import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Basketball API')
    .setDescription(
      'API para gerenciamento de dados de basquete - fixtures, times, ligas, standings e muito mais.',
    )
    .setVersion('1.0')
    .addTag('Auth', 'Autenticação e gerenciamento de usuários')
    .addTag('Countries', 'Países com ligas de basquete')
    .addTag('Leagues', 'Ligas e campeonatos')
    .addTag('Teams', 'Times de basquete')
    .addTag('Fixtures', 'Jogos e partidas')
    .addTag('Standings', 'Tabelas de classificação')
    .addTag('H2H', 'Confrontos diretos entre times')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Digite o token JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Basketball API Docs',
    customfavIcon: 'https://nestjs.com/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `Swagger docs available at: http://localhost:${process.env.PORT ?? 3000}/api/docs`,
  );
}
bootstrap();
