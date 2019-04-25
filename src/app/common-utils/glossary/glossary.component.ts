import { Component, OnInit } from '@angular/core';
import { GlossaryService } from './../../rest/glossary/glossary.service';

@Component({
  selector: 'app-glossary',
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.scss']
})
export class GlossaryComponent implements OnInit {
  glossaryList: any;
  glossaryData: any[];

  constructor(private glossaryService: GlossaryService) {}

  ngOnInit() {
    this.glossaryService.getBusinessGlossaryData().subscribe(response => {
      this.glossaryList = JSON.parse(JSON.stringify(response));
      /* for (let i = 0; i < this.glossaryList.length; i++) {
        this.glossaryList[i].BusinessGlossary.ProviderDashboardName.metricData =
        this.glossaryList[i].BusinessGlossary.ProviderDashboardName.Metric.replace(/[^a-zA-Z]/g, '');
        }
      this.glossaryData = this.glossaryList.sort(function(a, b) {
        if (a.BusinessGlossary.ProviderDashboardName.Metric.toLowerCase() <
        b.BusinessGlossary.ProviderDashboardName.Metric.toLowerCase()) { // sort string ascending
              return -1;
            } else if (a.BusinessGlossary.ProviderDashboardName.Metric.toLowerCase() >
            b.BusinessGlossary.ProviderDashboardName.Metric.toLowerCase()) {
            return 1;
          } else {
            return 0;
            }
    });*/
    });
  }
}
