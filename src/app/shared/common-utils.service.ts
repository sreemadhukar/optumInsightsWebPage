/* @author gmounika */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TimePeriod } from '../head/uhci-filters/filter-settings/filter-options';
import { lobName } from '../modals/lob-name';

@Injectable({
  providedIn: 'root'
})
export class CommonUtilsService {
  public currentYear = 2019;
  public currentYearMinusOne = (this.currentYear - 1).toString();
  public currentYearMinusTwo = (this.currentYear - 2).toString();
  public currentYearMinusThree = (this.currentYear - 3).toString();

  constructor(private router: Router) {}

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
    if (temp > 0) {
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
    if (temp > 0) {
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
  public checkLessThanOne(number: Number): string {
    if (number < 1) {
      return '< 1';
    } else {
      return number.toFixed(0);
    }
  }

  public matchLobWithData(lob) {
    if (lob === lobName.all) {
      return 'All';
    } else if (lob === lobName.eAndICommerCial) {
      return 'Ei';
    } else if (lob === lobName.mAndRMedicare) {
      return 'Mr';
    } else if (lob === lobName.cAndSMedicaid) {
      return 'Cs';
    } else if (lob === lobName.unCategorized) {
      return 'Un';
    }
  }
  public matchLobWithCapsData(lob) {
    if (lob === lobName.all) {
      return 'All';
    } else if (lob === lobName.eAndICommerCial) {
      return 'EI';
    } else if (lob === lobName.mAndRMedicare) {
      return 'MR';
    } else if (lob === lobName.cAndSMedicaid) {
      return 'CS';
    }
  }
  public matchLobWithLobData(lob) {
    if (lob === lobName.all) {
      return 'All';
    } else if (lob === lobName.eAndICommerCial) {
      return 'E&I';
    } else if (lob === lobName.mAndRMedicare) {
      return 'M&R';
    } else if (lob === lobName.cAndSMedicaid) {
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
    if (lob === lobName.all) {
      return 'ALL';
    } else if (lob === lobName.eAndICommerCial) {
      return 'EmployerAndIndividual';
    } else if (lob === lobName.mAndRMedicare) {
      return 'MedicareAndRetirement';
    } else if (lob === lobName.cAndSMedicaid) {
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
  public dayFormat(day: string): string {
    /*
    if (day[0] === '0') {
      return day.slice(1);
    } else {
      return day;
    }
    */
    return day;
  }
  public dateFormatPriorAuth(timeStamp: string): string {
    const x = timeStamp.split('-'); // "02-09-2020"
    const y = this.ReturnMonthlyString(x[0]) + ' ' + this.dayFormat(x[1]) + ', ' + x[2]; // Feb 02, 2019
    return y;
  }
  public dateFormat(timeStamp: string): string {
    if (!timeStamp) {
      return null;
    } else {
      let date1;
      if (timeStamp.includes('T')) {
        date1 = timeStamp.split('T'); // "2019-07-01T00:00:00.000+0000"
      } else {
        date1 = timeStamp.split(' '); // "2019-02-01 06:00:00"
      }
      const x = date1[0].split('-'); // "2019-02-01"
      const y = this.ReturnMonthlyString(x[1]) + ' ' + this.dayFormat(x[2]) + ', ' + x[0]; // Feb 02, 2019
      return y;
    }
  }

  public checkZeroNegative(value: number): boolean {
    return value <= 0 ? false : true;
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
  public returnHoverLabels(cardData, lobValue) {
    const hoverLabels = [];
    if (cardData !== null) {
      if (lobValue === 'All' || lobValue === 'ALL') {
        if (
          (cardData.hasOwnProperty('Mr') && cardData.Mr !== null) ||
          (cardData.hasOwnProperty('MedicareAndRetirement') && cardData.MedicareAndRetirement !== null)
        ) {
          hoverLabels.push(lobName.mAndRMedicare);
        }
        if (
          (cardData.hasOwnProperty('Cs') && cardData.Cs !== null) ||
          (cardData.hasOwnProperty('CommunityAndState') && cardData.CommunityAndState !== null)
        ) {
          hoverLabels.push(lobName.cAndSMedicaid);
        }
        if (
          (cardData.hasOwnProperty('Ei') && cardData.Ei !== null) ||
          (cardData.hasOwnProperty('EmployerAndIndividual') && cardData.EmployerAndIndividual !== null)
        ) {
          hoverLabels.push(lobName.eAndICommerCial);
        }
        if (
          (cardData.hasOwnProperty('Un') && cardData.Un !== null) ||
          (cardData.hasOwnProperty('UNKNOWN') && cardData.UNKNOWN !== null)
        ) {
          hoverLabels.push(lobName.unCategorized);
        }
      } else if (lobValue === 'Mr' || lobValue === 'MedicareAndRetirement') {
        if (cardData.hasOwnProperty('Mr') || cardData.hasOwnProperty('MedicareAndRetirement')) {
          hoverLabels.push(lobName.mAndRMedicare);
          hoverLabels.push('Other Lines of Business');
        }
      } else if (lobValue === 'Cs' || lobValue === 'CommunityAndState') {
        if (cardData.hasOwnProperty('Cs') || cardData.hasOwnProperty('CommunityAndState')) {
          hoverLabels.push(lobName.cAndSMedicaid);
          hoverLabels.push('Other Lines of Business');
        }
      } else if (lobValue === 'Ei' || lobValue === 'EmployerAndIndividual') {
        if (cardData.hasOwnProperty('Ei') || cardData.hasOwnProperty('EmployerAndIndividual')) {
          hoverLabels.push(lobName.eAndICommerCial);
          hoverLabels.push('Other Lines of Business');
        }
      } else if (lobValue === 'Un' || lobValue === 'UNKNOWN') {
        if (cardData.hasOwnProperty('Un' || cardData.hasOwnProperty('UNKNOWN'))) {
          hoverLabels.push(lobName.unCategorized);
          hoverLabels.push('Other Lines of Business');
        }
      }
      return hoverLabels;
    }
  }
  /** Function to show hovers colors as per Lob**/
  public returnLobColor(cardData, lobValue) {
    const hoverColors = [];

    if (cardData !== null) {
      if (lobValue === 'All' || lobValue === 'ALL') {
        if (
          (cardData.hasOwnProperty('Mr') && cardData.Mr !== null) ||
          (cardData.hasOwnProperty('MedicareAndRetirement') && cardData.MedicareAndRetirement !== null)
        ) {
          hoverColors.push('#3381FF');
        }
        if (
          (cardData.hasOwnProperty('Cs') && cardData.Cs !== null) ||
          (cardData.hasOwnProperty('CommunityAndState') && cardData.CommunityAndState !== null)
        ) {
          hoverColors.push('#80B0FF');
        }
        if (
          (cardData.hasOwnProperty('Ei') && cardData.Ei !== null) ||
          (cardData.hasOwnProperty('EmployerAndIndividual') && cardData.EmployerAndIndividual !== null)
        ) {
          hoverColors.push('#003DA1');
        }
        if (
          (cardData.hasOwnProperty('Un') && cardData.Un !== null) ||
          (cardData.hasOwnProperty('UNKNOWN') && cardData.UNKNOWN !== null)
        ) {
          hoverColors.push('#00B8CC');
        }
      } else if (lobValue === 'Mr' || lobValue === 'MedicareAndRetirement') {
        if (cardData.hasOwnProperty('Mr') || cardData.hasOwnProperty('MedicareAndRetirement')) {
          hoverColors.push('#3381FF');
          hoverColors.push('#D7DCE1');
        }
      } else if (lobValue === 'Cs' || lobValue === 'CommunityAndState') {
        if (cardData.hasOwnProperty('Cs') || cardData.hasOwnProperty('CommunityAndState')) {
          hoverColors.push('#80B0FF');
          hoverColors.push('#D7DCE1');
        }
      } else if (lobValue === 'Ei' || lobValue === 'EmployerAndIndividual') {
        if (cardData.hasOwnProperty('Ei') || cardData.hasOwnProperty('EmployerAndIndividual')) {
          hoverColors.push('#003DA1');
          hoverColors.push('#D7DCE1');
        }
      } else if (lobValue === 'Un' || lobValue === 'UNKNOWN') {
        if (cardData.hasOwnProperty('Un') || cardData.hasOwnProperty('UNKNOWN')) {
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
 labels: [lobName.mAndRMedicare, lobName.cAndSMedicaid, lobName.eAndICommerCial, lobName.unCategorized],
 color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
* */

  // ALL
  // Medicare
  // Medicaid
  // Commercial
  // Uncategorized
  public graphValuePrint(LOBType, data, value) {
    const keys = this.LOBSideLabels(LOBType, data);
    const combine = [];
    for (let i = 0; i < keys.length; i++) {
      const temp1 = keys[i] + ' (' + this.nondecimalFormatter(value[i]) + ')';
      combine.push(temp1);
    }
    return combine;
  }

  // This function is used in Payment page for the Claims paid card
  public LOBSideLabels(LOBType, data) {
    const lobLabels = [];
    if (LOBType === 'All' || LOBType === 'ALL') {
      if (data[0] > 0) {
        lobLabels.push(lobName.mAndRMedicare);
      }
      if (data[1] > 0) {
        lobLabels.push(lobName.cAndSMedicaid);
      }
      if (data[2] > 0) {
        lobLabels.push(lobName.eAndICommerCial);
      }
      if (data[3] > 0) {
        lobLabels.push(lobName.unCategorized);
      }
    } else {
      if (LOBType === 'Mr' || LOBType === 'MedicareAndRetirement') {
        lobLabels.push(lobName.mAndRMedicare);
      }
      if (LOBType === 'Cs' || LOBType === 'CommunityAndState') {
        lobLabels.push(lobName.cAndSMedicaid);
      }
      if (LOBType === 'Ei' || LOBType === 'EmployerAndIndividual') {
        lobLabels.push(lobName.eAndICommerCial);
      }
      if (LOBType === 'Un' || LOBType === 'Uncategorized') {
        lobLabels.push(lobName.unCategorized);
      }
    }
    return lobLabels;
  }

  public lobNameForSideLabels(LOBType, data) {
    const lobColorLabels = [];
    if (LOBType === 'All' || LOBType === 'ALL') {
      if (data.Mr !== null) {
        lobColorLabels.push(lobName.mAndRMedicare); // M and R Color
      }
      if (data.Cs !== null) {
        lobColorLabels.push(lobName.cAndSMedicaid); // C and S Color
      }
      if (data.Ei !== null) {
        lobColorLabels.push(lobName.eAndICommerCial); // E and I Color
      }
      if (data.Un !== null) {
        lobColorLabels.push(lobName.unCategorized); // Un Color
      }
    } else {
      if (LOBType === 'Mr' || LOBType === 'MedicareAndRetirement') {
        lobColorLabels.push(lobName.mAndRMedicare);
      }
      if (LOBType === 'Cs' || LOBType === 'CommunityAndState') {
        lobColorLabels.push(lobName.cAndSMedicaid);
      }
      if (LOBType === 'Ei' || LOBType === 'EmployerAndIndividual') {
        lobColorLabels.push(lobName.eAndICommerCial);
      }
      if (LOBType === 'Un' || LOBType === 'Uncategorized') {
        lobColorLabels.push(lobName.unCategorized);
      }
    }
    return lobColorLabels;
  }

  public lobColorForLabels(LOBType, data) {
    const lobColorLabels = [];
    if (LOBType === 'All' || LOBType === 'ALL') {
      if (data.Mr !== null) {
        lobColorLabels.push('#3381FF'); // M and R Color
      }
      if (data.Cs !== null) {
        lobColorLabels.push('#80B0FF'); // C and S Color
      }
      if (data.Ei !== null) {
        lobColorLabels.push('#003DA1'); // E and I Color
      }
      if (data.Un !== null) {
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

  public sideLabelValues(data) {
    const sideLabelValues = [];
    if (data[0] > 0) {
      sideLabelValues.push(data[0]);
    }
    if (data[1] > 0) {
      sideLabelValues.push(data[1]);
    }
    if (data[2] > 0) {
      sideLabelValues.push(data[2]);
    }
    if (data[3] > 0) {
      sideLabelValues.push(data[3]);
    }
    return sideLabelValues;
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

  public getTimePeriodFilterValue(timeFrame) {
    return TimePeriod.find(value => value.name === timeFrame).value;
  }

  public getFullLobData(lob) {
    if (lob === 'ALL') {
      return 'ALL';
    } else if (lob === 'EI') {
      return 'EmployerAndIndividual';
    } else if (lob === 'MR') {
      return 'MedicareAndRetirement';
    } else if (lob === 'CS') {
      return 'CommunityAndState';
    } else if (lob === 'Uncategorized') {
      return 'Uncategorized';
    }
  }
}
