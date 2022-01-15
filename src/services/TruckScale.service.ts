import { Injectable } from '@nestjs/common';
import Device from '../utils/tcpclient';
import SendAlertEmail from '../utils/sendEmail';

@Injectable()
export class TruckScaleService {
  emailSent = null;
  firstConnection = true;
  device = null;
  values = [];
  weigthRetentionTime = 7000; //milliseconds

  constructor() {
    this.device = new Device({
      host: process.env.SERIAL_CONVERTER_IP,
      port: process.env.SERIAL_CONVERTER_PORT,
    } as any);
    this.device.on('data', (chunk) => {
      const data = chunk.toString('utf8').replace(/\D/g, '');
      if (this.values.length >= 3) {
        this.values.shift();
      }
      if (data.length === 12) {
        this.values.push({
          data: data,
          time: Date.now(),
        });
      }
    });

    this.device.on('connect', () => {
      if (this.emailSent !== null && this.firstConnection === false) {
        SendAlertEmail(
          'Conexão com a balança da portaria foi reestabelecida',
          `Conexão com a balança da portaria foi reestabelecida em ${new Date().toLocaleString(
            'pt-br',
          )}`,
        );
        this.emailSent = null;
      }
      this.firstConnection = false;
    });

    this.device.on('error', (e) => {
      if (this.emailSent === null && this.firstConnection === false) {
        this.emailSent = new Date().toLocaleString('pt-br');
        SendAlertEmail(
          'Conexão com a balança da portaria foi perdida',
          `Conexão com a balança da portaria foi perdida em ${new Date().toLocaleString(
            'pt-br',
          )} <br> Erro: ${e}`,
        );
      }
    });

    this.device.connect();
  }

  isValidWeight() {
    return this.values.every((val, i, arr) => val.data === arr[0].data);
  }

  clearOldDataWeigth() {
    if (this.values.length === 0) {
      return;
    }

    const weightTime = this.values[this.values.length - 1].time;
    const currentTime = Date.now();
    if (weightTime < currentTime - this.weigthRetentionTime) {
      this.values.pop();
      this.clearOldDataWeigth();
    }
  }

  getWeight(): any {
    this.clearOldDataWeigth();
    if (this.values.length > 1) {
      if (this.isValidWeight()) {
        const weight = this.values[0].data.slice(1, 6);
        return weight.toString();
      } else {
        return 'Aguardando estabilização da pesagem';
      }
    } else {
      return 'Erro durante a conexão com o conversor serial/tcp';
    }
  }
}
