import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'timeperiod' })
export class TimePeriodPipe implements PipeTransform {
  transform(value: any): string {
    const { years, quarters, format } = value;
    let timeFrame = '';
    if (format === 'Quarter and Year') {
      timeFrame = 'Q' + quarters[0] + ' ' + years[0];
    } else if (format === 'Year') {
      timeFrame = years[0];
    } else if (format === 'Quarter vs Quarter') {
      const timeFramePart1 = 'Q' + quarters[0] + ' ' + years[0];
      const timeFramePart2 = 'Q' + quarters[1] + ' ' + years[1];
      const join = ' v. ';
      timeFrame = timeFramePart1 + join + timeFramePart2;
    }
    return timeFrame;
  }
}
