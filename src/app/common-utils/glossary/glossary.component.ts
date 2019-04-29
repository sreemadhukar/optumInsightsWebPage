import { Component, OnChanges, Input } from '@angular/core';
import { GlossaryService } from './../../rest/glossary/glossary.service';
import { catchError } from 'rxjs/operators';

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
    if (this.title != undefined || this.title != null) {
      this.glossaryService.getBusinessGlossaryData().subscribe(
        response => {
          this.glossaryList = response;

          this.glossaryList = this.glossaryList.filter(
            item => item.BusinessGlossary.ProviderDashboardName.Metric === 'Claims yield'
          );
          console.log(this.glossaryList);
        },
        err => {
          console.log('error', err);
        }
      );
    } // end if
  } // end ngOnChanges
} // end export class
