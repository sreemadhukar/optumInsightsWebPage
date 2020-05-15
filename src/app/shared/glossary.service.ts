import { Injectable } from '@angular/core';
import { GlossaryService } from '../rest/glossary/glossary.service';

@Injectable({
  providedIn: 'root'
})
export class GlossarySharedService {
  glossaryData: any = {
    kop: [],
    uhci: []
  };
  constructor(private glossaryService: GlossaryService) {}

  public init() {
    // Cache KOP Glossary and UHCI Glossa
    this.getData({ kop: true });
    this.getData({ kop: false });
  }

  public async getData(params: any): Promise<any[]> {
    const { kop = false } = params;
    const key = kop ? 'kop' : 'uhci';
    // Cache Exists
    if (this.glossaryData[key].length > 0) {
      return this.glossaryData[key];
    }

    // Get Data From Server
    try {
      const glossaryData = await this.glossaryService.getBusinessGlossaryDataAsync(params);
      this.glossaryData[key] = glossaryData.map((glossaryDataItem: any) => {
        const { BusinessGlossary = {} } = glossaryDataItem;
        const { ProviderDashboardName = {} } = BusinessGlossary;
        const formattedGlossaryDataItem = { ...ProviderDashboardName };
        return formattedGlossaryDataItem;
      });
      return this.glossaryData[key];
    } catch (error) {
      return this.glossaryData[key];
    }
  }
}
