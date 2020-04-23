import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { HomeService } from '../../../../rest/advocate/home.service';
import { SessionService } from '../../../../shared/session.service';
import { IUserResponse, IAdvTinDetailsResponse } from '../user.class';
@Component({
  selector: 'app-impact-assignment',
  templateUrl: './impact-assignment.component.html',
  styleUrls: ['./impact-assignment.component.scss']
})
export class ImpactAssignmentComponent implements OnInit {
  public completeData: IAdvTinDetailsResponse[];
  constructor(
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private homeService: HomeService,
    private session: SessionService
  ) {
    iconRegistry.addSvgIcon(
      'star',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/star-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'round-search',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/round-search-24px.svg')
    );
  }

  ngOnInit() {
    // 'gpalomi1'
    // this.session.sessionStorage('loggedUser', 'MsId')
    this.homeService.getAdvDetails('gpalomi1').subscribe(
      data => {
        this.completeData = data;
        console.log('Data', data);
      },
      err => {
        console.log('Error Advocate home page', err);
      }
    );
  }
}
