import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlossaryExpandService {
  public glossaryFlag: Boolean = true;
  public glossaryTitle;

  constructor() {}
}
