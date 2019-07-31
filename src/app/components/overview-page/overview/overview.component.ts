import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { OverviewSharedService } from '../../../shared/overview/overview-shared.service';
import { SessionService } from '../../../shared/session.service';
import { StorageService } from '../../../shared/storage-service.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, AfterContentInit {
  overviewItems: any;
  mainCards: any;
  mockMainCards: any;
  selfServiceMiniCards: any;
  mockSelfServiceMiniCards: any;
  pageTitle: String = '';
  pagesubTitle: String = '';
  userName: String = '';
  opportunities: String = '';
  opportunitiesQuestion: String = '';
  welcomeMessage: String = '';
  subscription: any;
  loading = false;
  claimsLoading = false;
  callsLoading = false;
  priorAuthLoading = false;
  /***************** DONT CHANGE THESE *************/
  claimsPaidBlock: any;
  priorAuthBlock: any;
  selfServiceAdoptionBlock: any;
  claimsYieldBlock: any;
  medicareStarRatingBlock: any;
  totalCallsBlock: any;

  loadClaimsPaidCard = false;
  loadClaimsYieldCard = false;
  loadPrioirAuthCard = false;
  loadselfServiceAdoptionCard = false;
  loadMedicareStarRatingCard = false;
  loadTotalCallsCard = false;

  errorloadClaimsPaidCard = false;
  errorloadClaimsYieldCard = false;
  errorloadPrioirAuthCard = false;
  errorloadselfServiceAdoptionCard = false;
  errorloadMedicareStarRatingCard = false;
  errorloadTotalCallsCard = false;
  /***************** DONT CHANGE THESE *************/

  trendsData: any;
  printHeight = 800;
  printWidth = 700;

  constructor(
    private overviewsrc: OverviewSharedService,
    private checkStorage: StorageService,
    private session: SessionService,
    private iconRegistry: MatIconRegistry,
    private router: Router,
    sanitizer: DomSanitizer
  ) {
    this.pagesubTitle = 'Your Insights at a glance.';
    this.opportunities = 'Opportunities';
    this.opportunitiesQuestion = 'How much can online self service save you?';
    this.welcomeMessage = '';
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => {
      this.router.routeReuseStrategy.shouldReuseRoute = function() {
        return false;
      };
      const currentUrl = this.router.url + '?';
      this.router.navigateByUrl(currentUrl).then(() => {
        this.router.navigated = false;
        this.router.navigate([this.router.url]);
      });
    });
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */
    iconRegistry.addSvgIcon(
      'arrow',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-keyboard_arrow_right-24px.svg')
    );
  }
  ngOnInit() {
    /***************** DELETE LATER *************/
    /*this.claimsPaidBlock = {
      category: "small-card",
      data: {
        centerNumber: "$3434.6M",
        color: ["#3381FF", "#80B0FF", "#003DA1"],
        gdata: ["card-inner", "claimsPaidCardD3Donutss"],
        graphValues: [13440154.46, 65374225.25, 114778212.67]
      },
      sdata: {},
      timeperiod: "Last 6 Months",
      title: "Claims Paidss",
      toggle: true,
      type: "donut"
    };

    this.claimsYieldBlock = {
      category: "small-card",
      data: {
        centerNumber: "55%",
        color: ["#3381FF", "#D7DCE1"],
        gdata: ["card-inner", "claimsYieldCardD3Donutss"],
        graphValues: [100, 0]
      },
      sdata: {},
      timeperiod: "Last 6 Months",
      title: "Claims Yieldss",
      toggle: true,
      type: "donut"
    }*/
    this.overviewsrc.getAllTrends().then(trendData => {
      this.trendsData = trendData;
      this.claimsLoading = true;

      /* SERVICE CALL TO GET CLAIMS CARDS DATA */
      this.overviewsrc
        .getClaimsCards()
        .then(data => {
          this.loadClaimsPaidCard = false;
          this.loadClaimsYieldCard = false;

          this.errorloadClaimsPaidCard = false;
          this.errorloadClaimsYieldCard = false;

          this.claimsLoading = false;
          this.claimsPaidBlock = data[0];
          this.claimsYieldBlock = data[1];
          if (this.claimsPaidBlock.data != null && this.claimsPaidBlock.toggle) {
            this.loadClaimsPaidCard = true;
          } else if (this.claimsPaidBlock.status != null && this.claimsPaidBlock.toggle) {
            this.errorloadClaimsPaidCard = true;
          }
          if (this.claimsYieldBlock.data != null && this.claimsYieldBlock.toggle) {
            this.loadClaimsYieldCard = true;
          } else if (this.claimsYieldBlock.status != null && this.claimsYieldBlock.toggle) {
            this.errorloadClaimsYieldCard = true;
          }
          console.log(this.claimsPaidBlock);
          console.log(this.claimsYieldBlock);
        })
        .catch(reason => {
          this.claimsLoading = true;
          console.log(reason);
        });

      /* SERVICE CALL TO GET DATA FOR PRIOR AUTH CARD */
      this.priorAuthLoading = true;
      this.overviewsrc
        .getPriorAuthCardData(this.trendsData)
        .then(data => {
          this.loadPrioirAuthCard = false;
          this.errorloadPrioirAuthCard = false;
          this.priorAuthLoading = false;
          this.priorAuthBlock = data;
          if (this.priorAuthBlock.data != null && this.priorAuthBlock.toggle) {
            this.loadPrioirAuthCard = true;
          } else if (this.priorAuthBlock.status != null && this.priorAuthBlock.toggle) {
            this.errorloadPrioirAuthCard = true;
          }
        })
        .catch(reason => {
          this.priorAuthLoading = true;
          console.log(reason);
        });
      /* SERVICE CALL TO GET DATA FOR CALLS CARD */
      this.callsLoading = true;
      this.overviewsrc
        .getTotalCallsCardData(this.trendsData)
        .then(data => {
          this.callsLoading = false;
          this.loadTotalCallsCard = false;
          this.errorloadTotalCallsCard = false;
          this.totalCallsBlock = data;
          if (this.totalCallsBlock.data != null && this.totalCallsBlock.toggle) {
            this.loadTotalCallsCard = true;
          } else if (this.totalCallsBlock.status != null && this.totalCallsBlock.toggle) {
            this.errorloadTotalCallsCard = true;
          }
        })
        .catch(reason => {
          this.callsLoading = true;
          console.log(reason);
        });

      /***************** DON"T CHANGE THESE *************/
      this.loading = true;
      this.mockMainCards = [{}, {}, {}, {}, {}, {}];
      this.mockSelfServiceMiniCards = [{}, {}, {}, {}];
      this.overviewItems = [];
      this.mainCards = [];
      this.selfServiceMiniCards = [];
      this.overviewsrc
        .getOverviewData()
        .then(data => {
          this.loadselfServiceAdoptionCard = false;
          this.loadMedicareStarRatingCard = false;

          this.errorloadselfServiceAdoptionCard = false;
          this.errorloadMedicareStarRatingCard = false;

          this.loading = false;
          this.overviewItems = JSON.parse(JSON.stringify(data));
          console.log(this.overviewItems[0]);
          this.mainCards = this.overviewItems[0];

          this.selfServiceAdoptionBlock = this.mainCards[0];
          this.medicareStarRatingBlock = this.mainCards[1];

          if (this.selfServiceAdoptionBlock.data != null && this.selfServiceAdoptionBlock.toggle) {
            this.loadselfServiceAdoptionCard = true;
          } else if (this.selfServiceAdoptionBlock.status != null && this.selfServiceAdoptionBlock.toggle) {
            this.errorloadselfServiceAdoptionCard = true;
          }
          if (this.medicareStarRatingBlock.data != null && this.medicareStarRatingBlock.toggle) {
            this.loadMedicareStarRatingCard = true;
          } else if (this.medicareStarRatingBlock.status != null && this.medicareStarRatingBlock.toggle) {
            this.errorloadMedicareStarRatingCard = true;
          }

          this.selfServiceMiniCards = this.overviewItems[1];
          console.log(this.overviewItems[0]);
        })
        .catch(reason => {
          this.loading = true;
          console.log(reason);
        });
    });

    const userInfo = JSON.parse(sessionStorage.getItem('loggedUser'));
    this.userName =
      this.session.sessionStorage('loggedUser', 'LastName') +
      ' ' +
      this.session.sessionStorage('loggedUser', 'FirstName');
    this.pageTitle = 'Hello, ' + userInfo.FirstName + '.';
  }

  ngAfterContentInit() {}
}
