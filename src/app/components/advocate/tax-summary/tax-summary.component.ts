import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SessionService } from '../../../shared/session.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-tax-summary',
  templateUrl: './tax-summary.component.html',
  styleUrls: ['./tax-summary.component.scss']
})
export class TaxSummaryComponent implements OnInit {
  @Input() data;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort, {static: true}) sort: MatSort;

  taxSummaryColumns: string[] = ['Tin', 'Tinname', 'TaxIdType', 'MajorMarketName'];
  providerName: string;
  numberOfTins: any;
  tinsData: any;
  taxSummaryData: any;
  constructor(private iconRegistry: MatIconRegistry, private session: SessionService, sanitizer: DomSanitizer) {
    //   // this.session.getTins().then(data => {
    //   //   this.taxData = data;
    // this.selectedtins.paginator._intl.firstPageLabel = 'Display';
    // });
    iconRegistry.addSvgIcon(
      'backButton',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/TIN-List-Back-Button-Icon.svg')
    );
    iconRegistry.addSvgIcon(
      'search',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/round-search-24px.svg')
    );
    iconRegistry.addSvgIcon('info', sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/info-24px.svg'));
    iconRegistry.addSvgIcon(
      'downarrow',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/arrow_downward-24px.svg')
    );
  }

  ngOnInit() {
    this.providerName = this.session.getHealthCareOrgName();
    // setTimeout(() => {
    if (this.data != null) {
      this.tinsData = this.data.All;
      for (let i = 0; i < this.tinsData.length; i++) {
        if (this.tinsData[i].Tinname === 'TIN Name Not Found') {
          this.tinsData[i].Tinname = 'Tax ID Name Not Available';
        }
        this.numberOfTins = this.tinsData.length;
      }
      this.paginator._intl.itemsPerPageLabel = 'Display';
      this.paginator._intl.getRangeLabel = function(page, pageSize, length) {
        return 'Page ' + Math.floor(page + 1) + ' of ' + Math.floor(length / pageSize + 1);
      };
      this.taxSummaryData = new MatTableDataSource(this.data);
      this.taxSummaryData.paginator = this.paginator;
    }
    // }, 4000)
  }
}
