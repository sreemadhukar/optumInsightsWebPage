/* @author gmounika */
import { Injectable } from '@angular/core';
import { ProviderService } from '../../rest/provider/provider.service';

@Injectable({
  providedIn: 'root'
})
export class ProviderSharedService {
  constructor(private providerService: ProviderService) { }
  public providersList(text) {
    return this.providerService.getProvidersData(text);
  }
}
