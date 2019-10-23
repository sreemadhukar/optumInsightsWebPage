import { Injectable } from '@angular/core';
import { NPSService } from 'src/app/rest/nps/nps.service';
@Injectable({
  providedIn: 'root'
})
export class NPSSharedService {
  constructor(private npsRestService: NPSService) {}

  public getNPSSummary(callback: any) {
    this.npsRestService.getNPSSummary().subscribe((response: any) => {
      return callback(response);
    });
  }
}
