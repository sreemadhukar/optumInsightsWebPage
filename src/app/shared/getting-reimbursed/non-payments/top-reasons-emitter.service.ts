import { Injectable } from '@angular/core';
interface IsendData {
  fullData: Object;
  reasonSelected: string;
  subReason: string;
}

@Injectable({
  providedIn: 'root'
})
export class TopReasonsEmitterService {
  public sendData: IsendData;
  constructor() {}
}
