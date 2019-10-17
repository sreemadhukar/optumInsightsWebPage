/* @author gmounika */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class CommonUtilsService {
  public currentYear = 2019;
  public currentYearMinusOne = (this.currentYear - 1).toString();
  public currentYearMinusTwo = (this.currentYear - 2).toString();
  public currentYearMinusThree = (this.currentYear - 3).toString();

  constructor(private router: Router, private session: SessionService) {}

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
      return parseFloat(fnumber)
        .toFixed(1)
        .replace(/\.0$/, '');
    }
    return fnumber;
  }

  public negativeMeansGood(trendNumber: number) {
    const value = trendNumber.toFixed(1) + '%';
    let temp: object = {};
    if (trendNumber >= 1) {
      temp = {
        sign: 'up-red',
        data: value
      };
    } else if (trendNumber < 1 && trendNumber >= 0) {
      temp = {
        sign: 'neutral',
        data: 'No Change'
      };
    } else {
      temp = {
        sign: 'down-green',
        data: value
      };
    }
    return temp;
  }
  public trendNegativeMeansGood(last30: number, previousLast30: number): Object {
    const temp = ((last30 - previousLast30) / previousLast30) * 100;
    let value = '';
    const suffix = '%';
    let tempSign;
    // if (temp >= 1) {
    if (temp >= 0) {
      tempSign = 'up-red'; // red color
      value = '+' + temp.toFixed() + suffix;
      // } else if (temp < 1 && temp >= 0) {
    } else if (temp === 0) {
      tempSign = 'neutral';
      value = 'No Change';
    } else {
      tempSign = 'down-green'; // green color
      value = temp.toFixed() + suffix;
    }

    return {
      sign: tempSign,
      data: value
    };
  }
  public trendNegativeMeansBad(last30: number, previousLast30: number): Object {
    const temp = ((last30 - previousLast30) / previousLast30) * 100;
    let value = '';
    const suffix = '%';
    let tempSign;
    // if (temp >= 1) {
    if (temp >= 0) {
      tempSign = 'up'; // green color
      value = '+' + temp.toFixed() + suffix;
      // } else if (temp < 1 && temp >= 0) {
    } else if (temp === 0) {
      tempSign = 'neutral';
      value = 'No Change';
    } else {
      tempSign = 'down'; // red color
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
    } else if (lob === 'Employer & Individual') {
      return 'Ei';
    } else if (lob === 'Medicare & Retirement') {
      return 'Mr';
    } else if (lob === 'Community & State') {
      return 'Cs';
    } else if (lob === 'Uncategorized') {
      return 'Un';
    }
  }
  public matchLobWithCapsData(lob) {
    if (lob === 'All') {
      return 'All';
    } else if (lob === 'Employer & Individual') {
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
    } else if (lob === 'Employer & Individual') {
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
    } else if (lob === 'Employer & Individual') {
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
  public ReturnMonthlyCountString(a) {
    if (a === 0) {
      return '01';
    } else if (a === 1) {
      return '02';
    } else if (a === 2) {
      return '03';
    } else if (a === 3) {
      return '04';
    } else if (a === 4) {
      return '05';
    } else if (a === 5) {
      return '06';
    } else if (a === 6) {
      return '07';
    } else if (a === 7) {
      return '08';
    } else if (a === 8) {
      return '09';
    } else if (a === 9) {
      return '10';
    } else if (a === 10) {
      return '11';
    } else if (a === 11) {
      return '12';
    }
  }
  public dayFormat(day: string) {
    if (day[0] === '0') {
      return day.slice(1);
    } else {
      return day;
    }
  }
  public dateFormat(timeStamp: string): string {
    const date1 = timeStamp.split(' '); // "2019-02-01 06:00:00"
    const x = date1[0].split('-'); // "2019-02-01"
    const y = this.ReturnMonthlyString(x[1]) + ' ' + this.dayFormat(x[2]) + ', ' + x[0]; // Feb 02, 2019
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

  public generateMonth(a) {
    if (a === 0) {
      return 'January';
    } else if (a === 1) {
      return 'February';
    } else if (a === 2) {
      return 'March';
    } else if (a === 3) {
      return 'April';
    } else if (a === 4) {
      return 'May';
    } else if (a === 5) {
      return 'June';
    } else if (a === 6) {
      return 'July';
    } else if (a === 7) {
      return 'August';
    } else if (a === 8) {
      return 'September';
    } else if (a === 9) {
      return 'October';
    } else if (a === 10) {
      return 'November';
    } else if (a === 11) {
      return 'December';
    } else {
      return null;
    }
  }

  /** Function to show hovers labels as per Lob**/
  public returnHoverLabels(cardData) {
    const hoverLabels = [];
    if (cardData !== null) {
      if (this.session.filterObjValue.lob === 'All') {
        if (cardData.hasOwnProperty('Mr')) {
          hoverLabels.push('Medicare & Retirement');
        }
        if (cardData.hasOwnProperty('Cs')) {
          hoverLabels.push('Community & State');
        }
        if (cardData.hasOwnProperty('Ei')) {
          hoverLabels.push('Employer & Individual');
        }
        if (cardData.hasOwnProperty('Un')) {
          hoverLabels.push('Uncategorized');
        }
      } else if (this.session.filterObjValue.lob === 'Medicare & Retirement') {
        if (cardData.hasOwnProperty('Mr')) {
          hoverLabels.push('Medicare & Retirement');
          hoverLabels.push('Other Lines of Business');
        }
      } else if (this.session.filterObjValue.lob === 'Community & State') {
        if (cardData.hasOwnProperty('Cs')) {
          hoverLabels.push('Community & State');
          hoverLabels.push('Other Lines of Business');
        }
      } else if (this.session.filterObjValue.lob === 'Employer & Individual') {
        if (cardData.hasOwnProperty('Ei')) {
          hoverLabels.push('Employer & Individual');
          hoverLabels.push('Other Lines of Business');
        }
      } else if (this.session.filterObjValue.lob === 'Uncategorized') {
        if (cardData.hasOwnProperty('Un')) {
          hoverLabels.push('Uncategorized');
          hoverLabels.push('Other Lines of Business');
        }
      }
      return hoverLabels;
    }
  }
  /** Function to show hovers colors as per Lob**/
  public returnLobColor(cardData) {
    const hoverColors = [];
    if (cardData !== null) {
      if (this.session.filterObjValue.lob === 'All') {
        if (cardData.hasOwnProperty('Mr')) {
          hoverColors.push('#3381FF');
        }
        if (cardData.hasOwnProperty('Cs')) {
          hoverColors.push('#80B0FF');
        }
        if (cardData.hasOwnProperty('Ei')) {
          hoverColors.push('#003DA1');
        }
        if (cardData.hasOwnProperty('Un')) {
          hoverColors.push('#00B8CC');
        }
      } else if (this.session.filterObjValue.lob === 'Medicare & Retirement') {
        if (cardData.hasOwnProperty('Mr')) {
          hoverColors.push('#3381FF');
          hoverColors.push('#D7DCE1');
        }
      } else if (this.session.filterObjValue.lob === 'Community & State') {
        if (cardData.hasOwnProperty('Cs')) {
          hoverColors.push('#80B0FF');
          hoverColors.push('#D7DCE1');
        }
      } else if (this.session.filterObjValue.lob === 'Employer & Individual') {
        if (cardData.hasOwnProperty('Ei')) {
          hoverColors.push('#003DA1');
          hoverColors.push('#D7DCE1');
        }
      } else if (this.session.filterObjValue.lob === 'Uncategorized') {
        if (cardData.hasOwnProperty('Un')) {
          hoverColors.push('#00B8CC');
          hoverColors.push('#D7DCE1');
        }
      }
      return hoverColors;
    }
  }
  public convertServiceCategoryOneWord(a) {
    let word = a;
    if (word.indexOf(' ') === 0) {
      return word;
    } else {
      // A couple of the service categories have special char
      word = word.replace('/', ' ');
      word = word.replace(/[^a-zA-Z ]/g, '');
      word = word.replace(/ /g, '_');
      return word;
    }
  }

  urlResuseStrategy() {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
    const currentUrl = this.router.url + '?';
    this.router.navigateByUrl(currentUrl).then(() => {
      this.router.navigated = false;
      if (this.router.url === '/ProviderSearch') {
        this.router.navigate(['/OverviewPage']);
      } else {
        this.router.navigate([this.router.url]);
      }
    });
  }

  /*
 labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
 color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
* */

  // ALL
  // MedicareAndRetirement
  // CommunityAndState
  // EmployerAndIndividual
  // Uncategorized

  public LOBSideLabels(LOBType, data) {
    const lobLabels = [];
    if (LOBType === 'All' || LOBType === 'ALL') {
      if (data[0] > 0) {
        lobLabels.push('Medicare & Retirement');
      }
      if (data[1] > 0) {
        lobLabels.push('Community & State');
      }
      if (data[2] > 0) {
        lobLabels.push('Employer & Individual');
      }
      if (data[3] > 0) {
        lobLabels.push('Uncategorized');
      }
    } else {
      if (LOBType === 'Mr' || LOBType === 'MedicareAndRetirement') {
        lobLabels.push('Medicare & Retirement');
      }
      if (LOBType === 'Cs' || LOBType === 'CommunityAndState') {
        lobLabels.push('Community & State');
      }
      if (LOBType === 'Ei' || LOBType === 'EmployerAndIndividual') {
        lobLabels.push('Employer & Individual');
      }
      if (LOBType === 'Un' || LOBType === 'Uncategorized') {
        lobLabels.push('Uncategorized');
      }
    }
    return lobLabels;
  }
  public LOBSideLabelColors(LOBType, data) {
    const lobColorLabels = [];
    if (LOBType === 'All' || LOBType === 'ALL') {
      if (data[0] > 0) {
        lobColorLabels.push('#3381FF'); // M and R Color
      }
      if (data[1] > 0) {
        lobColorLabels.push('#80B0FF'); // C and S Color
      }
      if (data[2] > 0) {
        lobColorLabels.push('#003DA1'); // E and I Color
      }
      if (data[3] > 0) {
        lobColorLabels.push('#00B8CC'); // Un Color
      }
    } else {
      if (LOBType === 'Mr' || LOBType === 'MedicareAndRetirement') {
        lobColorLabels.push('#3381FF');
      }
      if (LOBType === 'Cs' || LOBType === 'CommunityAndState') {
        lobColorLabels.push('#80B0FF');
      }
      if (LOBType === 'Ei' || LOBType === 'EmployerAndIndividual') {
        lobColorLabels.push('#003DA1');
      }
      if (LOBType === 'Un' || LOBType === 'Uncategorized') {
        lobColorLabels.push('#00B8CC');
      }
    }
    return lobColorLabels;
  }

  public sideLabelWords(data, labels) {
    const sideLabels = [];
    if (data[0] > 0) {
      sideLabels.push(labels[0]);
    }
    if (data[1] > 0) {
      sideLabels.push(labels[1]);
    }
    if (data[2] > 0) {
      sideLabels.push(labels[2]);
    }
    if (data[3] > 0) {
      sideLabels.push(labels[3]);
    }
    return sideLabels;
  }
  public sideLabelColor(data) {
    const sideLabelColors = [];
    if (data[0] > 0) {
      sideLabelColors.push('#3381FF');
    }
    if (data[1] > 0) {
      sideLabelColors.push('#80B0FF');
    }
    if (data[2] > 0) {
      sideLabelColors.push('#003DA1');
    }
    if (data[3] > 0) {
      sideLabelColors.push('#00B8CC');
    }
    return sideLabelColors;
  }
}
