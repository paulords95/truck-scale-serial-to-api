import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TruckScaleController } from './controllers/TruckScale.controller';
import { TruckScaleService } from './services/TruckScale.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), ConfigModule.forRoot()],
  controllers: [TruckScaleController],
  providers: [TruckScaleService],
})
export class AppModule {}
