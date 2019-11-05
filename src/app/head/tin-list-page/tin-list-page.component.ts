import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../shared/session.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-tin-list-page',
  templateUrl: './tin-list-page.component.html',
  styleUrls: ['./tin-list-page.component.scss']
})
export class TinListPageComponent implements OnInit {
  providerName: string;
  numberOfTins: string;
  tinsData: any;
  constructor(private iconRegistry: MatIconRegistry, private session: SessionService, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'backButton',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/TIN-List-Back-Button-Icon.svg')
    );
  }

  ngOnInit() {
    this.numberOfTins = '40';
    this.session.getTins().then(data => {
      this.tinsData = data;
    });
  }
}
