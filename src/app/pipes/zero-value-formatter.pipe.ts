import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zeroValueFormatter'
})
export class ZeroValueFormatterPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const temp: number = +value;
    if (temp < 1) {
      return '< 1';
    } else {
      return value;
    }
  }
}
