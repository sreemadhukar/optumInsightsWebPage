import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() index;
  @Input() tabData;
  @Input() selectedTab;
  @Input() handleCaseForOverviewTile = false;
  @Output() tabSelectEvent = new EventEmitter();
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
  routhPath: string;

  medicareBesideData = [{}];
  matOptionClicked(i: number) {
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

    this.selectedItemId = i;
    this.tabSelectEvent.next(i);
  }

  constructor(private glossaryExpandService: GlossaryExpandService, private router: Router) {
    this.tabOptions = ['All', 'Diabetic'];
  }

  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title, this.chartData.MetricID);
  }
  ngOnInit() {
    if (this.chartData && this.chartData.besideData) {
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
        // this.medicareData = this.chartData.data.All;
        this.selectedItemId = this.selectedTab ? parseInt(this.selectedTab) : 0;
        if (this.selectedItemId === 0) {
          this.medicareData = this.chartData.data.All;
        } else {
          this.medicareData = this.chartData.data.Diabetic;
        }
      }
    }
  }

  setLabels(labelArray, loopedValue, i) {
    if (this.chartData.title === 'Calls By Call Type' || this.chartData.title === 'Talk Time By Call Type') {
      return labelArray.graphValueName[labelArray.graphValueName.indexOf(loopedValue)];
    } else {
      return labelArray.labels[i];
    }
  }

  setValues(labelArray, loopedValue, i) {
    if (this.chartData.title === 'Calls By Call Type' || this.chartData.title === 'Talk Time By Call Type') {
      return labelArray.graphValues[labelArray.graphValueName.indexOf(loopedValue)];
    } else {
      return labelArray.graphValues[i];
    }
  }
}
