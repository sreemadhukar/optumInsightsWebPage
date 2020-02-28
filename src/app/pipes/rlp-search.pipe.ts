import { Pipe, PipeTransform } from '@angular/core';
interface IListItem {
  tin: string;
  groupName: string;
  graphData: any;
}

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
    console.log('args', args, 'tin', tinArgs, 'groupNameArg', groupNameArgs);
    return value.filter(el => {
      console.log('el.tin.indexOf(args)', el.tin.indexOf(tinArgs));
      if (el.tin.indexOf(tinArgs) !== -1 && typeof groupNameArgs === undefined) {
        return true;
      } else if (typeof tinArgs === undefined && typeof groupNameArgs === undefined) {
        return true;
      } else if (el.tin.indexOf(tinArgs) !== -1 && el.groupName.indexOf(groupNameArgs) !== -1) {
        return true;
      }
    });
  }
}
