import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temporaryTextFormatter'
})
export class TemporaryTextFormatterPipe implements PipeTransform {
  transform(value: any): any {
    switch (value) {
      case 'Prior Authorizations':
        return 'Prior Auth';
      case 'Eligibility and Benefits':
        return 'Eligibility/Benefits';
      case 'FI (Fully Insured)':
        return 'FI';
      case 'ASO (Administrative Services Only)':
        return 'ASO';
      default:
        return value;
    }
  }
}
