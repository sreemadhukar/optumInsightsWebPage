import { Pipe, PipeTransform } from '@angular/core';
import { CommonUtilsService } from '../shared/common-utils.service';
@Pipe({
  name: 'zeroValueFormatter'
})
export class ZeroValueFormatterPipe implements PipeTransform {
  constructor(private common: CommonUtilsService) {}
  transform(value: any, args?: any): string {
    const temp: number = +value;
    if (temp < 1) {
      return '< 1';
    } else {
      return this.common.nondecimalFormatter(temp);
    }
  }
}
