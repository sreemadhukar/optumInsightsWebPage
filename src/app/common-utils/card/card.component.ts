import { Component, OnInit, Input } from '@angular/core';
import { GlossaryExpandService } from '../../shared/glossary-expand.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() chartData;
  @Input() skeleton;
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
  matOptionClicked(i: number, event: any) {
    this.previousSelected = i;

    const myTabs = document.querySelectorAll('ul.nav-tabs > li');
    for (let j = 0; j < myTabs.length; j++) {
      myTabs[j].classList.remove('active');
      this.diabeticDivData = true;
      this.allData = false;
    }
    myTabs[i].classList.add('active');
  }

  constructor(private glossaryExpandService: GlossaryExpandService) {
    this.tabOptions = ['All', 'Diabetic'];
  }

  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title);
  }
  ngOnInit() {
    this.tabOptions = ['All', 'Diabetic'];
    this.selectedItemId = 0;
    this.allData = true;
    this.diabeticDivData = false;
  }
}
