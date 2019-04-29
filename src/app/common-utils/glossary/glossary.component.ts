import { Component, OnChanges, Input } from '@angular/core';
import { GlossaryService } from './../../rest/glossary/glossary.service';

@Component({
  selector: 'app-glossary',
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.scss']
})
export class GlossaryComponent implements OnChanges {
  glossaryList: any;
  glossaryData: any[];
  @Input() title;

  constructor(private glossaryService: GlossaryService) {}

  ngOnChanges() {
    this.glossaryService.getBusinessGlossaryData().subscribe(response => {
      this.glossaryList = response;

      this.glossaryList = this.glossaryList.filter(
        item => item.BusinessGlossary.ProviderDashboardName.Metric === 'Claims yield'
      );
      console.log(this.glossaryList);
    });
  }
}
