import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchHighlight'
})
export class SearchHighlightPipe implements PipeTransform {
  transform(value: any, args: any): any {
    if (!args) {
      return value;
    }
    const result = new RegExp(args, 'gi');
    return value.replace(result, match => {
      return `<span class="highlight-text">${match}</span>`;
    });
  }
}
