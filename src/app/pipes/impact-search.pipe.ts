import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'impactSearch'
})
export class ImpactSearchPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (typeof args === undefined) {
      return value;
    }
    const regex = new RegExp(`${args}`, 'g');
    return value.filter(el => regex.test(el.Tin) || regex.test(el.TinName));
  }
}
