import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(timestamp: string): string {

    const seconds = Math.floor((Date.now() - Date.parse(timestamp)) / 1000);

    let interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " AÑOS";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      const msg = Math.floor(interval) > 1 ? " MESES" : " MES";
      return Math.floor(interval) + msg;
    }
    interval = seconds / 86400;
    if (interval > 1) {
      const msg = Math.floor(interval) > 1 ? " DIAS" : " DIA";
      return Math.floor(interval) + msg;
    }
    interval = seconds / 3600;
    if (interval > 1) {
      const msg = Math.floor(interval) > 1 ? " HORAS" : " HORAS";
      return Math.floor(interval) + msg;
    }
    interval = seconds / 60;
    if (interval > 1) {
      const msg = Math.floor(interval) > 1 ? " MINUTOS" : " MINUTOS";
      return Math.floor(interval) + msg;
    }
    const msg = Math.floor(interval) > 1 ? " SEGUNDOS" : " SEGUNDO";
    return Math.floor(interval) + msg;

  }

}