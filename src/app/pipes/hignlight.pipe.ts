import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  transform(text: string, search): string {
    const pattern = search
      .replace(/^[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/, '$&')
      .split(' ')
      .filter(t => t.length > 0)
      .join('|');
    const regex = new RegExp(pattern, 'i');

    return search ? text.replace(regex, match => `${match}<b>`) : text;
  }
}
