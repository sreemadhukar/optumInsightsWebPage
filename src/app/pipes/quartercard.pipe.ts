import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'quarterpipe' })
export class QuarterPipe implements PipeTransform {
  transform(value: any): string {
    let result = '';
    const { year, quarter, format, index } = value;
    if (format === 'YTD') {
      if (index === 0) {
        result = format + ' ';
      }
      result += year;
    } else {
      result = 'Q' + quarter + ' ' + year;
    }
    return result;
  }
}
