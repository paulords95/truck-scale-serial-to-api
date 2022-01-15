import { Controller, Get } from '@nestjs/common';
import { TruckScaleService } from '../services/TruckScale.service';

@Controller()
export class TruckScaleController {
  constructor(private readonly truckScaleService: TruckScaleService) {}

  @Get('/peso-balanca')
  getWeight(): string {
    console.log(process.env.TESTE);
    return this.truckScaleService.getWeight();
  }
}
