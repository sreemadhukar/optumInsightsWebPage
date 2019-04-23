/* @author gmounika */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonUtilsService {
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
    return fnumber;
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
}
