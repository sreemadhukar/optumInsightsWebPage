import { Component, OnInit, ViewChild } from '@angular/core';
import { SessionService } from '../../shared/session.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as d3 from 'd3';

@Component({
  selector: 'app-tin-list-page',
  templateUrl: './tin-list-page.component.html',
  styleUrls: ['./tin-list-page.component.scss']
})
export class TinListPageComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  tinsDisplayedColumns: string[] = ['Tin', 'Tinname'];
  providerName: string;
  numberOfTins: any;
  tinsData: any;
  selectedtins: any;
  constructor(private iconRegistry: MatIconRegistry, private session: SessionService, sanitizer: DomSanitizer) {
    this.session.getTins().then(data => {
      this.tinsData = data;
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
      this.selectedtins = new MatTableDataSource(this.tinsData);
      this.selectedtins.paginator = this.paginator;
      // this.selectedtins.paginator._intl.firstPageLabel = 'Display';
    });
    iconRegistry.addSvgIcon(
      'backButton',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/TIN-List-Back-Button-Icon.svg')
    );
    iconRegistry.addSvgIcon(
      'search',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/round-search-24px.svg')
    );
    iconRegistry.addSvgIcon('info', sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/info-24px.svg'));
  }

  ngOnInit() {
    this.providerName = this.session.getHealthCareOrgName();
    this.tooltip();
  }
  tooltip() {
    d3.select('#tooltip-info')
      .style('position', 'absolute')
      .style('width', '230px')
      .style('height', '100px')
      .style('background-color', 'white')
      .style('border-radius', '2px')
      .style('display', 'none');

    d3.select('#tooltip-info-div').on('mouseenter', function(d) {
      d3.select('#tooltip-info-div').on('mouseover', function(e) {
        d3.select('#tooltip-info')
          .style('display', 'inline')
          .style('left', d3.event.layerX + 13 + 'px')
          .style('top', d3.event.layerY - 35 + 'px');
      });
    });
    d3.select('#tooltip-info-div').on('mouseleave', function(d) {
      d3.select('#tooltip-info')
        .style('display', 'none')
        .style('left', d3.event.layerX + 13 + 'px')
        .style('top', d3.event.layerY - 35 + 'px');
    });
  }
}
