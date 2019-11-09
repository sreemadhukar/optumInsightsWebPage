import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
@Pipe({
  name: 'countryFormatter'
})
export class CountryFormatterPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const pattern = value.split(',');
    pattern[0] = _.startCase(pattern[0].toLowerCase());
    return `${pattern[0]}, ${pattern[1]}`;
  }
}
