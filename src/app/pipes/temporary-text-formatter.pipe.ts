import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temporaryTextFormatter'
})
export class TemporaryTextFormatterPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    switch (value) {
      case 'Prior Authorizations':
        return 'Prior Auth';
      case 'Medicare & Retirement':
        return 'M&R';
      case 'Community & State':
        return 'C&S';
      case 'Employer & Individual':
        return 'E&I';
      case 'Eligibility and Benefits':
        return 'Eligibility and Benefits';
      default:
        return value;
    }
  }
}
