import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temporaryTextFormatter'
})
export class TemporaryTextFormatterPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    switch (value) {
      case 'Prior Authorizations':
        return 'Prior Auth';
      case 'Eligibility and Benefits':
        return 'Eligibility/Benefits';
      default:
        return value;
    }
  }
}
