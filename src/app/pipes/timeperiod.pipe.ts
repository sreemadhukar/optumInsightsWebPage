import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'timeperiod' })
export class TimePeriodPipe implements PipeTransform {
  transform(value: any): string {
    const { years, quarters, format } = value;
    let timeFrame = '';
    switch (format) {
      case 'Quarter and Year':
        return (timeFrame = 'Q' + quarters[0] + ' ' + years[0]);
      case 'Year':
        return (timeFrame = years[0]);
      case 'Quarter vs Quarter':
        const timeFramePart1 = 'Q' + quarters[0] + ' ' + years[0];
        const timeFramePart2 = 'Q' + quarters[1] + ' ' + years[1];
        const join = ' v. ';
        return (timeFrame = timeFramePart1 + join + timeFramePart2);
      case 'Last Year':
        return (timeFrame = years[1]);
    }
  }
}
