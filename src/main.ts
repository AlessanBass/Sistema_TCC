import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import exphbs = require('express-handlebars');


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configuração para visualizações (views)
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // Configuração para arquivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Configuração para Handlebars partials
  const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'index',
    layoutsDir: join(__dirname, '..', 'views'),
    partialsDir: [
      join(__dirname, '..', 'views/partials'),
    ]
  });

  app.engine('hbs', hbs.engine);


  await app.listen(3000);
}
bootstrap();
