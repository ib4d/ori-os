import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';

async function bootstrap() {
    const app = await NestFactory.create(WorkerModule);
    await app.listen(3002); // Worker runs on a different port or just processes jobs
    console.log('Worker is running');
}
bootstrap();
