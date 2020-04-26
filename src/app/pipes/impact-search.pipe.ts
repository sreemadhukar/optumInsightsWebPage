import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'impactSearch'
})
export class ImpactSearchPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }
    const regex = new RegExp(`${args}`, 'ig');
    return value.filter(
      el => regex.test(el.Tin) || regex.test(el.FormattedTin) || regex.test(el.TinName) || regex.test(el.ProviderSystem)
    );
  }
}
