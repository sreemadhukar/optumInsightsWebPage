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
  glossaryTitleShow: String = '';
  @Input() title;

  constructor(private glossaryService: GlossaryService) {}

  ngOnChanges() {
    if (this.title != undefined || this.title != null) {
      this.glossaryService.getBusinessGlossaryData().subscribe(
        response => {
          this.glossaryTitleShow = this.title;
          this.glossaryList = response.filter(
            item => item.BusinessGlossary.ProviderDashboardName.Metric === 'Claims yield'
          );
        },
        err => {
          console.log('error', err);
        }
      );
    } // end if
  } // end ngOnChanges
} // end export class
