import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'timeperiod' })
export class TimePeriodPipe implements PipeTransform {
  transform(value: any): string {
    const { years, quarters, format, type } = value;
    let timeFrame = '';

    if (type === 'summary') {
      const year1 = years[0];
      const year2 = years[years.length - 1];
      return year2 + ' - ' + year1;
    }

    switch (format) {
      case 'Quarter and Year':
        timeFrame = 'Q' + quarters[0] + ' ' + years[0];
        break;
      case 'Year':
        timeFrame = years[0];
        break;
      case 'Quarter vs Quarter':
        const timeFramePart1 = 'Q' + quarters[0] + ' ' + years[0];
        const timeFramePart2 = 'Q' + quarters[1] + ' ' + years[1];
        const join = ' v. ';
        timeFrame = timeFramePart1 + join + timeFramePart2;
        break;
      case 'Last Year':
        timeFrame = years[1] ? years[1] : years[0];
        break;
    }
    return '(' + timeFrame + ')';
  }
}
