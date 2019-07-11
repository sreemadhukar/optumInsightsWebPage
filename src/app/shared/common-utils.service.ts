/* @author gmounika */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonUtilsService {
  public currentYear = 2019;
  public currentYearMinusOne = (this.currentYear - 1).toString();
  public currentYearMinusTwo = (this.currentYear - 2).toString();
  public currentYearMinusThree = (this.currentYear - 3).toString();

  constructor() {}

  public nFormatter(fnumber) {
    if (fnumber >= 1000000000) {
      return (fnumber / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (fnumber >= 1000000) {
      return (fnumber / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (fnumber >= 1000) {
      return (fnumber / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    if (fnumber < 1000) {
      return fnumber.toFixed(1).replace(/\.0$/, '');
    }
    return fnumber;
  }
  public last30DaysTrend(last30: number, previousLast30: number): Object {
    const temp = ((last30 - previousLast30) / previousLast30) * 100;
    let value = '';
    const suffix = '%';
    let tempSign;
    if (temp > 0) {
      tempSign = 'up';
      value = '+' + temp.toFixed() + suffix;
    } else if (temp === 0) {
      tempSign = 'neutral';
      value = 'No Change';
    } else {
      tempSign = 'down';
      value = temp.toFixed() + suffix;
    }
    return {
      sign: tempSign,
      data: value
    };
  }
  public percentageFormatter(number: Number) {
    if (number < 1) {
      return '< 1%';
    } else {
      return number.toFixed(0) + '%';
    }
  }

  public matchLobWithData(lob) {
    if (lob === 'All') {
      return 'All';
    } else if (lob === 'Employee & Individual') {
      return 'Ei';
    } else if (lob === 'Medicare & Retirement') {
      return 'Mr';
    } else if (lob === 'Community & State') {
      return 'Cs';
    }
  }
  public matchLobWithCapsData(lob) {
    if (lob === 'All') {
      return 'All';
    } else if (lob === 'Employee & Individual') {
      return 'EI';
    } else if (lob === 'Medicare & Retirement') {
      return 'MR';
    } else if (lob === 'Community & State') {
      return 'CS';
    }
  }
  public matchLobWithLobData(lob) {
    if (lob === 'All') {
      return 'All';
    } else if (lob === 'Employee & Individual') {
      return 'E&I';
    } else if (lob === 'Medicare & Retirement') {
      return 'M&R';
    } else if (lob === 'Community & State') {
      return 'C&S';
    }
  }

  public matchLobWithFilData(lob) {
    if (lob === 'All') {
      return 'All';
    } else if (lob === 'E&I') {
      return 'Ei';
    } else if (lob === 'M&R') {
      return 'Mr';
    } else if (lob === 'C&S') {
      return 'Cs';
    }
  }
  public matchFullLobWithFilData(lob) {
    if (lob === 'All') {
      return 'ALL';
    } else if (lob === 'E&I') {
      return 'EmployerAndIndividual';
    } else if (lob === 'M&R') {
      return 'MedicareAndRetirement';
    } else if (lob === 'C&S') {
      return 'CommunityAndState';
    }
  }
  public matchFullLobWithData(lob) {
    if (lob === 'All') {
      return 'ALL';
    } else if (lob === 'Employee & Individual') {
      return 'EmployerAndIndividual';
    } else if (lob === 'Medicare & Retirement') {
      return 'MedicareAndRetirement';
    } else if (lob === 'Community & State') {
      return 'CommunityAndState';
    }
  }
  public matchTimePeriodWithJSON(timeframe) {
    if (timeframe === 'Calendar Year ' + this.currentYearMinusOne) {
      return this.currentYearMinusOne;
    } else if (timeframe === 'Calendar Year ' + this.currentYearMinusTwo) {
      return this.currentYearMinusTwo;
    } else if (timeframe === 'Last 12 Months') {
      return 'last12months';
    } else if (timeframe === 'Year to Date') {
      return 'yeartodate';
    }
  }
  public ReturnMonthlyString(a: string): string {
    let monthString: string;
    switch (a) {
      case '01':
        monthString = 'January';
        break;
      case '02':
        monthString = 'February';
        break;
      case '03':
        monthString = 'March';
        break;
      case '04':
        monthString = 'April';
        break;
      case '05':
        monthString = 'May';
        break;
      case '06':
        monthString = 'June';
        break;
      case '07':
        monthString = 'July';
        break;
      case '08':
        monthString = 'August';
        break;
      case '09':
        monthString = 'September';
        break;
      case '10':
        monthString = 'October';
        break;
      case '11':
        monthString = 'November';
        break;
      case '12':
        monthString = 'December';
        break;
      default:
        monthString = null;
    }
    return monthString != null ? monthString.substring(0, 3) : null;
  }
  public dateFormat(timeStamp: string): string {
    const date1 = timeStamp.split(' '); // "2019-02-01 06:00:00"
    const x = date1[0].split('-'); // "2019-02-01"
    const y = this.ReturnMonthlyString(x[1]) + ' ' + x[2] + ', ' + x[0]; // Feb 02, 2019
    return y;
  }

  public nondecimalFormatter(fnumber) {
    if (fnumber >= 1000000000) {
      return (fnumber / 1000000000).toFixed(0).replace(/\.0$/, '') + 'B';
    }
    if (fnumber >= 1000000) {
      return (fnumber / 1000000).toFixed(0).replace(/\.0$/, '') + 'M';
    }
    if (fnumber >= 1000) {
      return (fnumber / 1000).toFixed(0).replace(/\.0$/, '') + 'K';
    }
    if (fnumber < 1000) {
      return fnumber.toFixed(0).replace(/\.0$/, '');
    }
    return fnumber;
  }
}
