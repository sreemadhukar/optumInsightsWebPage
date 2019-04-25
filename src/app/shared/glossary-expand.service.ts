import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlossaryExpandService {
  public glossaryFlag: boolean;
  public glossaryTitle;

  constructor() {}
}
