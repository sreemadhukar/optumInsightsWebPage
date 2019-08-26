import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormatter'
})
export class CurrencyFormatterPipe implements PipeTransform {
  transform(fnumber: any, args?: any): any {
    if (fnumber >= 1000000000) {
      return (fnumber / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (fnumber >= 1000000) {
      return (fnumber / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (fnumber >= 1000) {
      return (fnumber / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    if (fnumber < 1000) {
      return parseFloat(fnumber)
        .toFixed(1)
        .replace(/\.0$/, '');
    }
    return fnumber;
  }
}
