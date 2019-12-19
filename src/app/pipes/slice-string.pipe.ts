import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'sliceString'
})
export class SliceStringPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    value = value.toLowerCase();
    if (value.includes('only')) {
      const pattern = value.split(' only');
      pattern[0] = _.startCase(pattern[0]);
      return pattern[0];
    } else {
      return value.replace(/\w\S*/g, txt => txt[0].toUpperCase() + txt.substr(1));
    }
  }
}
