import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'impactSearch'
})
export class ImpactSearchPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    console.log('value, args', args);
    return value;
  }
}
