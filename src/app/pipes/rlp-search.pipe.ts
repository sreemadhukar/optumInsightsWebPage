import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rlpSearch'
})
export class RlpSearchPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const tinArgs = [args[0]];
    const groupNameArgs = [args[1]];
    if (typeof tinArgs === undefined && typeof groupNameArgs === undefined) {
      return value;
    }

    return value.filter(el => {
      if (el.tin.indexOf(tinArgs) !== -1 && typeof groupNameArgs === undefined) {
        return true;
      } else if (typeof tinArgs === undefined && el.groupName.toLowerCase().indexOf(groupNameArgs) !== -1) {
        return true;
      } else if (el.tin.indexOf(tinArgs) !== -1 && el.groupName.toLowerCase().indexOf(groupNameArgs) !== -1) {
        return true;
      }
    });
  }
}
