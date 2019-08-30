import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minuteSeconds'
})
export class MinuteSecondsPipe implements PipeTransform {
  transform(value: number): any {
    const minutes: number = Math.floor(value / 60);
    const seconds: number = value - minutes * 60;

    let minuteValue: any;
    minuteValue = minutes;
    if (minutes < 10) {
      minuteValue = '0' + minutes;
    }

    let secondsValue: any;
    secondsValue = seconds;
    if (seconds < 10) {
      secondsValue = '0' + seconds;
    }

    return minuteValue + ':' + secondsValue;
  }
}
