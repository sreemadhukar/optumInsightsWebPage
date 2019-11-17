import { Component, OnInit, Input } from '@angular/core';
import { GlossaryExpandService } from '../../shared/glossary-expand.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() chartData;
  @Input() skeleton;
  @Input() tabData;
  printStyle: boolean; // this variable is used for print-page style
  heightDonut: Number = 234;
  widthDonut: Number = 234;
  heightRotatingArrow: Number = 212;
  widthRotatingArrow: Number = 225;
  heightSmallBarChart: Number = 155;
  widthSmallBarChart: Number = 268;
  customSmallBarChart: Boolean = false;
  previousSelected: any = 0;
  tabOptions = [];
  diabeticDivData: Boolean = false;
  allData: Boolean = true;
  selectedItemId: any = 0;
  medicareData: any;

  medicareBesideData = [{}];
  matOptionClicked(i: number, event: any) {
    this.medicareData = {};

    this.previousSelected = i;
    this.allData = true;
    const myTabs = document.querySelectorAll('ul.nav-tabs > li');
    for (let j = 0; j < myTabs.length; j++) {
      myTabs[j].classList.remove('active');
      this.diabeticDivData = true;
      this.allData = false;
    }
    myTabs[i].classList.add('active');

    if (i === 0) {
      this.medicareBesideData = [
        {
          label: this.chartData.besideData.All.verticalData[1].labels,
          values: this.chartData.besideData.All.verticalData[1].values
        },
        {
          label: this.chartData.besideData.All.verticalData[2].labels,
          values: this.chartData.besideData.All.verticalData[2].values
        }
      ];
      this.medicareData = this.chartData.data.All;
    } else {
      this.medicareData = this.chartData.data.Diabetic;

      this.medicareBesideData = [
        {
          label: this.chartData.besideData.Diabetic.verticalData[1].labels,
          values: this.chartData.besideData.Diabetic.verticalData[1].values
        },
        {
          label: this.chartData.besideData.Diabetic.verticalData[2].labels,
          values: this.chartData.besideData.Diabetic.verticalData[2].values
        }
      ];
    }
  }

  constructor(private glossaryExpandService: GlossaryExpandService, private router: Router) {
    this.tabOptions = ['All', 'Diabetic'];
  }

  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title, this.chartData.MetricID);
  }
  ngOnInit() {
    if (this.router.url.includes('print-')) {
      this.printStyle = true;
    }

    if (this.tabData) {
      this.medicareBesideData = [
        {
          label: this.chartData.besideData.All.verticalData[1].labels,
          values: this.chartData.besideData.All.verticalData[1].values
        },
        {
          label: this.chartData.besideData.All.verticalData[2].labels,
          values: this.chartData.besideData.All.verticalData[2].values
        }
      ];
      this.medicareData = this.chartData.data.All;
      this.selectedItemId = 0;
    }
  }
}
